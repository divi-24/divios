// appConfig.js
import React from 'react';
import WallpaperSetter from './WallpaperSetter';
import Notepad from './Notepad';
import CalendarApp from './CalendarApp';
import Terminal from './Terminal';
import Calculator from './Calculator';
import MailApp from './MailApp';
import SafariApp from './SafariApp';
import VSCodeApp from './VSCodeApp';
import Launchpad from './Launchpad';
import Game2048 from './Game2048';
import Tetris from './Tetris';
import FileManagerApp from './FileManagerApp';
import JsonToTsConverter from './JsonToTsConverter';
import MessageApp from './MessageApp';
import MapApp from './MapApp';
import VideoPlayer from './VideoPlayer';
import ReactPlayground from './ReactPlayground';
import AIAssistantApp from './AIAssistantApp/AIAssistantApp';
import GoldenShinyCard3D  from './ShinyCard3D';
import JSONFormatter from './JSONFormatter';
import CSSGradientGenerator from './CSSGradientGenerator';
import RegexTester from './RegexTester';
import Base64EncoderDecoder from './Base64EncoderDecoder';
import URLParser from './URLParser';
const appConfig = [
  {
    name: 'Shader Cards',
    icon: '🃏', // Card emoji
    component: GoldenShinyCard3D,
    defaultSize: { width: 800, height: 600 }
  },
  {
    name: 'URL Parser',
    icon: '🌐',
    component: URLParser,
    defaultSize: { width: 700, height: 600 }
  },
  {
    name: 'AI Assistant',
    icon: '🤖',
    component: AIAssistantApp,
    defaultSize: { width: 1200, height: 600 },
    showInDock: true,
  },
  {
    name: 'Base64 Converter',
    icon: '📄', // Alternatively use '🔐' for lock icon
    component: Base64EncoderDecoder,
    defaultSize: { width: 600, height: 500 }
  },
  {
    name: 'Regex Tester',
    icon: '🔍',
    component: RegexTester,
    defaultSize: { width: 600, height: 400 }
  },
  {
    name: 'JSON Formatter',
    icon: '🔧', // Wrench emoji for tools
    component: JSONFormatter,
    defaultSize: { width: 800, height: 600 }
  },
  {
    name: 'React Playground',
    icon: '⚛️',
    component: ReactPlayground,
    defaultSize: { width: 1000, height: 600 },
    showInDock: false,
  },
  {
    name: 'Video Player',
    icon: '🎞️',
    component: VideoPlayer,
    defaultSize: { width: 800, height: 600 }
  },
  {
    name: 'CSS Gradient',
    icon: '🌈',
    component: CSSGradientGenerator,
    defaultSize: { width: 600, height: 600 }
  },
  {
    name: 'Map',
    icon: '🗺️',
    component: MapApp,
    defaultSize: { width: 800, height: 600 }
  },
  {
    name: 'Launchpad',
    icon: '🚀',
    component: Launchpad,
    defaultSize: { width: 800, height: 600 },
    showInDock: true,
  },
  {
    name: 'Finder',
    icon: '📁',
    component: ({ onClose }) => <div>This is the Finder window content.</div>,
    defaultSize: { width: 600, height: 400 },
    showInDock: false,
  },
  {
    name: 'JSON to TS Converter',
    icon: '🔄', 
    component: JsonToTsConverter,
    defaultSize: { width: 600, height: 400 }
  },
  {
    name: 'Safari',
    icon: '🌐',
    component: SafariApp,
    defaultSize: { width: 1000, height: 700 },
    showInDock: true,
  },
  {
    name: 'Messages',
    icon: '💬',
    component: MessageApp,
    defaultSize: { width: 800, height: 600 },
    showInDock: true,
  },
  {
    name: 'Mail',
    icon: '✉️',
    component: MailApp,
    defaultSize: { width: 800, height: 600 },
    showInDock: true,
  },
  {
    name: 'Settings',
    icon: '⚙️',
    component: WallpaperSetter,
    defaultSize: { width: 800, height: 600 },
    showInDock: true,
  },
  {
    name: 'Calendar',
    icon: '📅',
    component: CalendarApp,
    defaultSize: { width: 800, height: 600 },
    showInDock: true,
  },
  {
    name: 'Terminal',
    icon: '🖥️',
    component: Terminal,
    defaultSize: { width: 600, height: 400 },
    showInDock: true,
  },
  {
    name: 'Calculator',
    icon: '🔢',
    component: Calculator,
    defaultSize: { width: 300, height: 540 },
    showInDock: false,
  },
  {
    name: 'VS Code',
    icon: 'VS',
    component: VSCodeApp,
    defaultSize: { width: 1024, height: 768 },
    showInDock: true,
  },
  {
    name: '2048',
    icon: '🎮',
    component: Game2048,
    defaultSize: { width: 400, height: 650 }
  },
  {
    name: 'Tetris',
    icon: '🧱', // Using a brick emoji as the icon
    component: Tetris,
    defaultSize: { width: 600, height: 800 }
  },
  {
    name: 'File Manager',
    icon: '📁', // 或者使用自定义图标
    component: FileManagerApp,
    defaultSize: { width: 800, height: 600 },
    showInDock: true,
  },
];

export default appConfig;