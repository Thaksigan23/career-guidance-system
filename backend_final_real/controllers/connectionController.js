// controllers/connectionController.js
// The professional network: connection requests, acceptance and listing.
import { supabase } from "../config/db.js";

// Find a connection row between two users in either direction.
async function findConnection(a, b) {
  const { data } = await supabase
    .from("connections")
    .select("*")
    .or(
      `and(requester_id.eq.${a},receiver_id.eq.${b}),and(requester_id.eq.${b},receiver_id.eq.${a})`
    )
    .limit(1);
  return data && data.length ? data[0] : null;
}

// =====================================================
// SEND REQUEST
// =====================================================
export const sendRequest = async (req, res) => {
  const me = req.user.id;
  const other = parseInt(req.params.id, 10);

  if (!other || other === me)
    return res.status(400).json({ error: "Invalid user" });

  const { data: target } = await supabase
    .from("users")
    .select("id")
    .eq("id", other)
    .maybeSingle();
  if (!target) return res.status(404).json({ error: "User not found" });

  const existing = await findConnection(me, other);
  if (existing)
    return res
      .status(409)
      .json({ error: "A connection already exists", status: existing.status });

  const { error } = await supabase
    .from("connections")
    .insert({ requester_id: me, receiver_id: other, status: "pending" });

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: "Connection request sent" });
};

// =====================================================
// RESPOND TO REQUEST (accept / reject) — by connection id
// =====================================================
export const respondRequest = async (req, res) => {
  const me = req.user.id;
  const connId = req.params.id;
  const action = req.body?.action;

  const { data: conn } = await supabase
    .from("connections")
    .select("*")
    .eq("id", connId)
    .maybeSingle();

  if (!conn || conn.receiver_id !== me || conn.status !== "pending")
    return res.status(404).json({ error: "Request not found" });

  if (action === "accept") {
    const { error } = await supabase
      .from("connections")
      .update({ status: "accepted" })
      .eq("id", connId);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ message: "Connection accepted" });
  }

  const { error } = await supabase.from("connections").delete().eq("id", connId);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Request declined" });
};

// =====================================================
// REMOVE CONNECTION (by the other user's id)
// =====================================================
export const removeConnection = async (req, res) => {
  const me = req.user.id;
  const other = parseInt(req.params.id, 10);

  const existing = await findConnection(me, other);
  if (!existing) return res.status(404).json({ error: "Not connected" });

  const { error } = await supabase
    .from("connections")
    .delete()
    .eq("id", existing.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Connection removed" });
};

// =====================================================
// LIST ACCEPTED CONNECTIONS
// =====================================================
export const listConnections = async (req, res) => {
  const me = req.user.id;

  const { data, error } = await supabase
    .from("connections")
    .select(
      "id, requester_id, receiver_id, requester:users!requester_id(id, full_name, role), receiver:users!receiver_id(id, full_name, role)"
    )
    .eq("status", "accepted")
    .or(`requester_id.eq.${me},receiver_id.eq.${me}`);

  if (error) return res.status(500).json({ error: error.message });

  const list = (data || []).map((c) => {
    const other = c.requester_id === me ? c.receiver : c.requester;
    return {
      connection_id: c.id,
      id: other?.id,
      full_name: other?.full_name,
      role: other?.role,
    };
  });

  res.json(list);
};

// =====================================================
// LIST INCOMING PENDING REQUESTS
// =====================================================
export const listPending = async (req, res) => {
  const me = req.user.id;

  const { data, error } = await supabase
    .from("connections")
    .select("id, requester:users!requester_id(id, full_name, role)")
    .eq("status", "pending")
    .eq("receiver_id", me);

  if (error) return res.status(500).json({ error: error.message });

  res.json(
    (data || []).map((c) => ({
      connection_id: c.id,
      id: c.requester?.id,
      full_name: c.requester?.full_name,
      role: c.requester?.role,
    }))
  );
};

// =====================================================
// SUGGESTIONS ("People you may know")
// =====================================================
export const suggestions = async (req, res) => {
  const me = req.user.id;

  const { data: users, error } = await supabase
    .from("users")
    .select("id, full_name, role")
    .neq("id", me)
    .in("role", ["student", "employer"])
    .eq("status", "active")
    .limit(60);

  if (error) return res.status(500).json({ error: error.message });

  const { data: conns } = await supabase
    .from("connections")
    .select("requester_id, receiver_id")
    .or(`requester_id.eq.${me},receiver_id.eq.${me}`);

  const connected = new Set();
  (conns || []).forEach((c) => {
    connected.add(c.requester_id);
    connected.add(c.receiver_id);
  });

  res.json((users || []).filter((u) => !connected.has(u.id)).slice(0, 12));
};

// =====================================================
// STATUS between me and a given user
// =====================================================
export const getStatus = async (req, res) => {
  const me = req.user.id;
  const other = parseInt(req.params.id, 10);

  if (other === me) return res.json({ status: "self" });

  const existing = await findConnection(me, other);
  if (!existing) return res.json({ status: "none" });
  if (existing.status === "accepted")
    return res.json({ status: "connected", connection_id: existing.id });
  if (existing.requester_id === me)
    return res.json({ status: "pending_outgoing", connection_id: existing.id });
  return res.json({ status: "pending_incoming", connection_id: existing.id });
};
