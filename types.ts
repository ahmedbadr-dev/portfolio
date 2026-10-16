/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


export interface Project {
  id: string;
  name: string;
  category: string;
  tag: string;
  image: string;
  description: string;
  url?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum Section {
  HERO = 'hero',
  SERVICES = 'services',
  WORK = 'work',
  PROCESS = 'process',
  STACK = 'stack',
  WHY = 'why',
}
