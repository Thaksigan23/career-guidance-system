import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Heart,
  MessageCircle,
  Trash2,
  Send,
  Users,
  Briefcase,
  Bookmark,
  FileText,
  LayoutDashboard,
  UserPlus,
  MapPin,
  BadgeCheck,
} from "lucide-react";
import {
  getFeed,
  createPost,
  deletePost,
  likePost,
  unlikePost,
  getPostComments,
  addPostComment,
  getPublicProfile,
  getConnectionSuggestions,
  sendConnectionRequest,
} from "../api/api";
import { useApp } from "../context/AppContext.jsx";

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const secs = Math.floor((Date.now() - d.getTime()) / 1000);
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

function avatar(name, size = 48) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "User"
  )}&background=8B5CF6&color=fff&size=${size * 2}&rounded=true&bold=true`;
}

function roleBadge(role) {
  if (role === "employer") return "badge badge-blue";
  if (role === "admin") return "badge badge-violet";
  return "badge badge-green";
}

export default function Feed() {
  const { user } = useApp();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [sentIds, setSentIds] = useState([]);

  async function loadFeed() {
    try {
      const data = await getFeed();
      setPosts(data || []);
    } catch {
      toast.error("Failed to load feed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeed();
    if (user?.id) {
      getPublicProfile(user.id)
        .then(setProfile)
        .catch(() => {});
      getConnectionSuggestions()
        .then((s) => setSuggestions(s || []))
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function handlePost(e) {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      setPosting(true);
      await createPost(content.trim());
      setContent("");
      toast.success("Post shared!");
      await loadFeed();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to post");
    } finally {
      setPosting(false);
    }
  }

  async function toggleLike(post) {
    const next = !post.liked;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, liked: next, like_count: p.like_count + (next ? 1 : -1) }
          : p
      )
    );
    try {
      if (next) await likePost(post.id);
      else await unlikePost(post.id);
    } catch {
      toast.error("Action failed");
      loadFeed();
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  async function connect(id) {
    try {
      await sendConnectionRequest(id);
      setSentIds((prev) => [...prev, id]);
      toast.success("Request sent");
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not connect");
    }
  }

  const role = user?.role;

  return (
    <div className="aurora-page px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_300px] gap-6">
        {/* LEFT: profile summary + quick links */}
        <aside className="hidden lg:block">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="panel overflow-hidden">
              <div className="h-16 bg-gradient-to-r from-cyan-500/30 via-violet-500/30 to-orange-500/20" />
              <div className="px-4 pb-4 -mt-8 text-center">
                <img
                  src={avatar(user?.full_name, 80)}
                  alt="me"
                  className="w-16 h-16 rounded-2xl mx-auto ring-2 ring-violet-500/40 bg-[#0c0a1d]"
                />
                <p className="font-semibold text-white mt-2">
                  {user?.full_name}
                </p>
                {profile?.headline && (
                  <p className="text-xs muted mt-0.5 line-clamp-2">
                    {profile.headline}
                  </p>
                )}
                <div className="flex items-center justify-center gap-3 mt-3 text-xs">
                  <span className="inline-flex items-center gap-1 muted">
                    <Users size={13} /> {profile?.connection_count ?? 0}
                  </span>
                  {profile?.open_to_work && (
                    <span className="badge badge-green text-[10px] px-2 py-0.5">
                      <BadgeCheck size={11} /> Open
                    </span>
                  )}
                </div>
                <Link
                  to="/profile"
                  className="btn-soft w-full mt-4 py-2 rounded-xl text-sm inline-block"
                >
                  View profile
                </Link>
              </div>
            </div>

            <div className="panel p-2">
              <SideLink to="/network" icon={Users} label="My Network" />
              <SideLink to="/jobs" icon={Briefcase} label="Jobs" />
              {role === "student" && (
                <>
                  <SideLink to="/saved-jobs" icon={Bookmark} label="Saved Jobs" />
                  <SideLink
                    to="/my-applications"
                    icon={FileText}
                    label="My Applications"
                  />
                </>
              )}
              {role === "employer" && (
                <>
                  <SideLink to="/employer-jobs" icon={Briefcase} label="My Jobs" />
                  <SideLink
                    to="/employer-dashboard"
                    icon={LayoutDashboard}
                    label="Dashboard"
                  />
                </>
              )}
            </div>
          </div>
        </aside>

        {/* CENTER: composer + feed */}
        <div className="min-w-0">
          {/* COMPOSER */}
          <form onSubmit={handlePost} className="panel p-5 mb-6">
            <div className="flex gap-3">
              <img
                src={avatar(user?.full_name)}
                alt="me"
                className="w-11 h-11 rounded-full ring-2 ring-violet-500/40"
              />
              <div className="flex-1">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="3"
                  className="field"
                  placeholder="Share an achievement, ask a question, post an update..."
                  maxLength={3000}
                />
                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    disabled={posting || !content.trim()}
                    className="btn-glow font-semibold px-5 py-2 rounded-xl inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    <Send size={16} /> {posting ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="panel p-5">
                  <div className="skeleton h-5 w-1/3 mb-3" />
                  <div className="skeleton h-4 w-full mb-2" />
                  <div className="skeleton h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="panel p-10 text-center">
              <p className="muted">
                No posts yet. Be the first to share something!
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={user?.id}
                  onLike={() => toggleLike(post)}
                  onDelete={() => handleDelete(post.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: people you may know */}
        <aside className="hidden lg:block">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="panel p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">
                  People you may know
                </h3>
                <Link to="/network" className="text-xs text-cyan-300">
                  See all
                </Link>
              </div>
              {suggestions.length === 0 ? (
                <p className="text-xs muted">No suggestions right now.</p>
              ) : (
                <div className="space-y-4">
                  {suggestions.slice(0, 4).map((s) => (
                    <div key={s.id} className="flex items-center gap-3">
                      <Link to={`/u/${s.id}`}>
                        <img
                          src={avatar(s.full_name, 40)}
                          alt={s.full_name}
                          className="w-10 h-10 rounded-full ring-1 ring-white/10"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/u/${s.id}`}
                          className="text-sm font-medium text-white hover:text-cyan-300 block truncate"
                        >
                          {s.full_name}
                        </Link>
                        <span className="text-[11px] muted capitalize">
                          {s.role}
                        </span>
                      </div>
                      {sentIds.includes(s.id) ? (
                        <span className="text-[11px] muted">Sent</span>
                      ) : (
                        <button
                          onClick={() => connect(s.id)}
                          className="rounded-full p-2 bg-white/5 text-cyan-300 hover:bg-cyan-500/20"
                          title="Connect"
                        >
                          <UserPlus size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {profile?.location && (
              <div className="panel p-4 text-sm">
                <p className="inline-flex items-center gap-2 muted">
                  <MapPin size={14} /> {profile.location}
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function SideLink({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition text-sm"
    >
      <Icon size={17} className="text-cyan-400" /> {label}
    </Link>
  );
}

function PostCard({ post, currentUserId, onLike, onDelete }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [count, setCount] = useState(post.comment_count || 0);

  async function toggleComments() {
    const next = !showComments;
    setShowComments(next);
    if (next && comments.length === 0) {
      try {
        setLoadingComments(true);
        const data = await getPostComments(post.id);
        setComments(data || []);
      } catch {
        toast.error("Failed to load comments");
      } finally {
        setLoadingComments(false);
      }
    }
  }

  async function submitComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await addPostComment(post.id, commentText.trim());
      setCommentText("");
      const data = await getPostComments(post.id);
      setComments(data || []);
      setCount((c) => c + 1);
    } catch {
      toast.error("Failed to comment");
    }
  }

  return (
    <div className="panel p-5">
      <div className="flex items-start gap-3">
        <Link to={`/u/${post.user_id}`}>
          <img
            src={avatar(post.author_name)}
            alt={post.author_name}
            className="w-11 h-11 rounded-full ring-2 ring-white/10"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/u/${post.user_id}`}
              className="font-semibold text-white hover:text-cyan-300"
            >
              {post.author_name}
            </Link>
            <span className={roleBadge(post.author_role)}>
              {post.author_role}
            </span>
            <span className="text-xs muted">· {timeAgo(post.created_at)}</span>
          </div>
        </div>
        {post.user_id === currentUserId && (
          <button
            onClick={onDelete}
            className="text-slate-500 hover:text-red-400 p-1"
            title="Delete post"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <p className="text-slate-200 whitespace-pre-line leading-relaxed mt-3">
        {post.content}
      </p>

      <div className="flex items-center gap-5 mt-4 pt-3 border-t border-white/10">
        <button
          onClick={onLike}
          className={`inline-flex items-center gap-1.5 text-sm transition ${
            post.liked ? "text-pink-400" : "text-slate-400 hover:text-pink-300"
          }`}
        >
          <Heart size={17} fill={post.liked ? "currentColor" : "none"} />
          {post.like_count > 0 && post.like_count}
          <span className="hidden sm:inline">Like</span>
        </button>
        <button
          onClick={toggleComments}
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-cyan-300"
        >
          <MessageCircle size={17} />
          {count > 0 && count}
          <span className="hidden sm:inline">Comment</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-3">
          <form onSubmit={submitComment} className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="field"
              placeholder="Write a comment..."
              maxLength={1000}
            />
            <button type="submit" className="btn-soft px-3 rounded-xl" title="Send">
              <Send size={16} />
            </button>
          </form>

          {loadingComments ? (
            <p className="muted text-sm">Loading comments...</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-2.5">
                <Link to={`/u/${c.user_id}`}>
                  <img
                    src={avatar(c.author_name, 36)}
                    alt={c.author_name}
                    className="w-9 h-9 rounded-full ring-1 ring-white/10"
                  />
                </Link>
                <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/u/${c.user_id}`}
                      className="text-sm font-semibold text-white hover:text-cyan-300"
                    >
                      {c.author_name}
                    </Link>
                    <span className="text-xs muted">· {timeAgo(c.created_at)}</span>
                  </div>
                  <p className="text-sm text-slate-200 mt-0.5">{c.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
