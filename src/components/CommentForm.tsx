"use client";
import { useState } from "react";
export default function CommentForm({ postId }) {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, postId }),
    });
    if (res.ok) {
      setStatus("ok");
      setMessage("Thanks. Your comment is waiting for approval.");
      form.reset();
    } else {
      setStatus("error");
      setMessage("Could not save the comment.");
    }
  }
  return (
    <form onSubmit={onSubmit} className="card mt-8 space-y-3 p-5">
      <h3 className="font-serif text-xl">Leave a comment</h3>
      <input name="name" required placeholder="Name" className="input" />
      <input name="email" type="email" required placeholder="Email" className="input" />
      <textarea name="content" required rows={4} placeholder="Your thoughts" className="input" />
      <button className="btn" type="submit">Submit</button>
      {status !== "idle" && <p className={status === "ok" ? "text-sm text-moss" : "text-sm text-red-600"}>{message}</p>}
    </form>
  );
}
