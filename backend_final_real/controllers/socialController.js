// controllers/socialController.js
// Activity feed: posts, likes and comments.
import { supabase } from "../config/db.js";

// =====================================================
// CREATE POST
// =====================================================
export const createPost = async (req, res) => {
  const userId = req.user.id;
  const content = (req.body?.content || "").trim();

  if (!content) return res.status(400).json({ error: "Post content is required" });
  if (content.length > 3000)
    return res.status(400).json({ error: "Post is too long (max 3000 characters)" });

  const { data, error } = await supabase
    .from("posts")
    .insert({ user_id: userId, content })
    .select("id")
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: "Post created", id: data?.id });
};

// =====================================================
// GET FEED (latest posts from everyone)
// =====================================================
export const getFeed = async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, content, created_at, user_id, author:users!user_id(full_name, role), post_likes(user_id), post_comments(count)"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return res.status(500).json({ error: error.message });

  const feed = (data || []).map((p) => ({
    id: p.id,
    content: p.content,
    created_at: p.created_at,
    user_id: p.user_id,
    author_name: p.author?.full_name || "User",
    author_role: p.author?.role || "",
    like_count: p.post_likes?.length || 0,
    liked: (p.post_likes || []).some((l) => l.user_id === userId),
    comment_count: p.post_comments?.[0]?.count || 0,
  }));

  res.json(feed);
};

// =====================================================
// DELETE POST (own only)
// =====================================================
export const deletePost = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;

  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", userId)
    .select("id");

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0)
    return res.status(404).json({ error: "Post not found" });

  res.json({ message: "Post deleted" });
};

// =====================================================
// LIKE / UNLIKE
// =====================================================
export const likePost = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;

  const { error } = await supabase
    .from("post_likes")
    .insert({ post_id: postId, user_id: userId });

  // Ignore unique-violation (already liked).
  if (error && !`${error.message}`.toLowerCase().includes("duplicate"))
    return res.status(500).json({ error: error.message });

  res.json({ message: "Liked" });
};

export const unlikePost = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;

  const { error } = await supabase
    .from("post_likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Unliked" });
};

// =====================================================
// COMMENTS
// =====================================================
export const getComments = async (req, res) => {
  const postId = req.params.id;

  const { data, error } = await supabase
    .from("post_comments")
    .select("id, content, created_at, user_id, author:users!user_id(full_name, role)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  res.json(
    (data || []).map((c) => ({
      id: c.id,
      content: c.content,
      created_at: c.created_at,
      user_id: c.user_id,
      author_name: c.author?.full_name || "User",
      author_role: c.author?.role || "",
    }))
  );
};

export const addComment = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;
  const content = (req.body?.content || "").trim();

  if (!content) return res.status(400).json({ error: "Comment cannot be empty" });
  if (content.length > 1000)
    return res.status(400).json({ error: "Comment is too long" });

  const { error } = await supabase
    .from("post_comments")
    .insert({ post_id: postId, user_id: userId, content });

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: "Comment added" });
};
