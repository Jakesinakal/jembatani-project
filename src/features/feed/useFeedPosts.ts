/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { mockPosts } from '@/data/mockData';
import { Post } from '@/types/post';

export function useFeedPosts() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  const handleAddPost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const isCurrentlyLiked = p.isLiked;
        return {
          ...p,
          isLiked: !isCurrentlyLiked,
          likesCount: isCurrentlyLiked ? p.likesCount - 1 : p.likesCount + 1,
        };
      }),
    );
  };

  return { posts, handleAddPost, handleLikePost };
}
