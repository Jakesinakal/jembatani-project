/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NegotiationDetails {
  productName: string;
  productPhoto: string;
  quantity: string;
  lastPriceOffer: number;
  originalPrice: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface ChatMessage {
  id: string;
  sender: 'ME' | 'PARTNER';
  text: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  partnerName: string;
  partnerAvatar: string;
  partnerVerified: boolean;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  hasActiveNegotiation: boolean;
  negotiationInfo?: NegotiationDetails;
  messages: ChatMessage[];
}
