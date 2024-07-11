"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Image, Input, Button, message } from "antd";
import axios from "axios";
import styles from "./PhotoList.module.css";

export default function PhotoList({ photos }) {
  const [comments, setComments] = useState({});

  useEffect(() => {
    const initialComments = {};
    photos.forEach((photo) => {
      initialComments[photo.id] = photo.Comments || [];
    });
    setComments(initialComments);
  }, [photos]);

  const handleAddComment = async (photoId, text) => {
    try {
      const response = await axios.post("/comments", {
        photoId,
        text,
      });
      const newComment = response.data;
      setComments((prev) => ({
        ...prev,
        [photoId]: [...(prev[photoId] || []), newComment],
      }));
    } catch (error) {
      console.error("Failed to add comment:", error);
      message.error("Failed to add comment.");
    }
  };

  return (
    <div className={styles.container}>
      {photos
        .sort((a, b) => b.id - a.id)
        .map((photo) => (
          <div key={photo.id} className={styles.photoCard}>
            <Image
              src={photo.filename}
              alt="Uploaded"
              width={200}
              height={200}
              className={styles.photo}
            />
            <div className={styles.commentsSection}>
              {comments[photo.id]?.map((comment) => (
                <div key={comment.id} className={styles.comment}>
                  <p>{comment.text}</p>
                  <span className={styles.timestamp}>
                    {format(new Date(comment.createdAt), "yyyy-MM-dd HH:mm:ss")}
                  </span>
                </div>
              ))}
            </div>
            <AddCommentForm
              photoId={photo.id}
              onAddComment={handleAddComment}
            />
          </div>
        ))}
    </div>
  );
}

function AddCommentForm({ photoId, onAddComment }) {
  const [text, setText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddComment(photoId, text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.commentForm}>
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment"
        style={{ width: "100%", marginRight: "10px" }}
      />
      <Button type="primary" htmlType="submit">
        Comment
      </Button>
    </form>
  );
}
