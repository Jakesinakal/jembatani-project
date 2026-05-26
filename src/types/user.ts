/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'PETANI' | 'PEMBELI';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  roles: UserRole[];
  currentRoleMode: UserRole;
  location: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified: boolean;
}
