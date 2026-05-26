/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useOutletContext } from 'react-router-dom';

// Layout and Common UI
import { SafeArea } from '@/components/layout/SafeArea';
import { BottomNav } from '@/components/layout/BottomNav';
import { CreateBottomSheet } from '@/components/layout/CreateBottomSheet';

// Feature screens
import Splash from '@/features/auth/Splash';
import Onboarding from '@/features/auth/Onboarding';
import Login from '@/features/auth/Login';
import Register from '@/features/auth/Register';
import Beranda from '@/features/feed/Beranda';
import Harga from '@/features/prices/Harga';
import HargaDetail from '@/features/prices/HargaDetail';
import Pesan from '@/features/messages/Pesan';
import ChatDetail from '@/features/messages/ChatDetail';
import Akun from '@/features/profile/Akun';
import CreateListing from '@/features/feed/CreateListing';

// Mock data and Typings
import { mockPosts } from '@/data/mockData';
import { Post } from '@/types/post';
import { UserRole } from '@/types/user';

// Shared Context typing
export interface AppShellContext {
  posts: Post[];
  onAddPost: (newPost: Post) => void;
  onLikePost: (postId: string) => void;
  currentRoleMode: UserRole;
  setCurrentRoleMode: (role: UserRole) => void;
}

// Layout frame which holds bottom bar and modal trigger
function AppShell() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [currentRoleMode, setCurrentRoleMode] = useState<UserRole>('PETANI');
  const [isPlusSheetOpen, setIsPlusSheetOpen] = useState(false);

  const handleAddPost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isCurrentlyLiked = p.isLiked;
          return {
            ...p,
            isLiked: !isCurrentlyLiked,
            likesCount: isCurrentlyLiked ? p.likesCount - 1 : p.likesCount + 1,
          };
        }
        return p;
      })
    );
  };

  const contextValue: AppShellContext = {
    posts,
    onAddPost: handleAddPost,
    onLikePost: handleLikePost,
    currentRoleMode,
    setCurrentRoleMode,
  };

  return (
    <SafeArea>
      {/* Scrollable outlet container */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Outlet context={contextValue} />
      </div>

      {/* Persistent Bottom Bar */}
      <BottomNav onPlusClick={() => setIsPlusSheetOpen(true)} />

      {/* Slide-up option chooser sheet */}
      <CreateBottomSheet isOpen={isPlusSheetOpen} onClose={() => setIsPlusSheetOpen(false)} />
    </SafeArea>
  );
}

// Wrapper for Authentication screens (which don't show the bottom navigation)
function AuthShell() {
  return (
    <SafeArea>
      <div className="flex-1 flex flex-col min-h-screen bg-surface">
        <Outlet />
      </div>
    </SafeArea>
  );
}

// Router instantiation representing createBrowserRouter and step redirections
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/splash" replace />,
  },
  {
    element: <AuthShell />,
    children: [
      { path: 'splash', element: <Splash /> },
      { path: 'onboarding', element: <Onboarding /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    element: <AppShell />,
    children: [
      {
        path: 'beranda',
        element: <BerandaWrapper />,
      },
      {
        path: 'harga',
        element: <Harga />,
      },
      {
        path: 'harga/:commodityId',
        element: <HargaDetail />,
      },
      {
        path: 'pesan',
        element: <Pesan />,
      },
      {
        path: 'pesan/:chatId',
        element: <ChatDetail />,
      },
      {
        path: 'akun',
        element: <AkunWrapper />,
      },
      {
        path: 'post/create',
        element: <CreateListingWrapper />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/splash" replace />,
  },
]);

// Wrapper component to pipe Context props safely
function BerandaWrapper() {
  const { posts, onLikePost, currentRoleMode } = useOutletContext<AppShellContext>();
  return <Beranda posts={posts} onLikePost={onLikePost} currentRoleMode={currentRoleMode} />;
}

function AkunWrapper() {
  const { currentRoleMode, setCurrentRoleMode } = useOutletContext<AppShellContext>();
  return <Akun currentRoleMode={currentRoleMode} onToggleRoleMode={setCurrentRoleMode} />;
}

function CreateListingWrapper() {
  const { onAddPost } = useOutletContext<AppShellContext>();
  return <CreateListing onAddPost={onAddPost} />;
}

export default function App() {
  return <RouterProvider router={router} />;
}
