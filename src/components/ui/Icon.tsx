import React from 'react';
import { View, type StyleProp, type TextStyle } from 'react-native';
import {
  Network, Plus, CirclePlus, ArrowLeft, ArrowDown, ArrowRight, ArrowUp, Sparkles,
  ChartColumn, Ban, Calendar, CircleX, Check, CircleCheck, ChevronLeft, ChevronRight,
  X, CircleAlert, FileText, Download, ClipboardCheck, File, Pencil, PartyPopper,
  CalendarX, ChevronUp, ChevronDown, ListChecks, Send, Sigma, SquareFunction,
  Grid2X2, Users, CircleHelp, History, Hourglass, UserCheck, Info, TrendingUp,
  TrendingDown, Lightbulb, Lock, LogOut, Mail, Menu, Bell, Pause, User, UserPlus,
  Play, Target, Circle, Clock, GraduationCap, Shield, Gauge, Table, Hash, Terminal,
  Inbox, Timer, SlidersHorizontal, ChevronsUpDown, CloudUpload, ShieldCheck, Eye, EyeOff,
  IdCard, Landmark, Moon, AlarmClock, BookOpen, Layers, Zap, type LucideIcon,
} from 'lucide-react-native';
import { colors } from '@/theme/tokens';
import type { IconName } from '@/types/ui';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'xxl';
const SIZE = { xs: 14, sm: 16, md: 18, lg: 20, xl: 22, '2xl': 28, '3xl': 36, '4xl': 40, xxl: 24 };
// Keep the established wrapper names so feature callers do not depend on the icon library.
const ICONS: Record<IconName, LucideIcon> = {
  account_tree: Network, add: Plus, add_circle: CirclePlus, arrow_back: ArrowLeft,
  arrow_downward: ArrowDown, arrow_forward: ArrowRight, arrow_upward: ArrowUp,
  auto_awesome: Sparkles, bar_chart: ChartColumn, block: Ban, bolt: Zap,
  calendar_month: Calendar, cancel: CircleX, check: Check, check_circle: CircleCheck,
  chevron_left: ChevronLeft, chevron_right: ChevronRight, close: X, danger: CircleAlert,
  description: FileText, download: Download, download_done: ClipboardCheck, draft: File,
  edit: Pencil, emoji_events: PartyPopper, error: CircleAlert, event_busy: CalendarX,
  expand_less: ChevronUp, expand_more: ChevronDown, fact_check: ListChecks,
  forward_to_inbox: Send, functions: Sigma, gesture: SquareFunction, ghost: CircleHelp,
  grid_on: Grid2X2, group: Users, help: CircleHelp, history: History, hub: Network,
  hourglass_empty: Hourglass, how_to_reg: UserCheck, info: Info, insights: TrendingUp,
  lightbulb: Lightbulb, local_fire_department: TrendingUp, lock: Lock, logout: LogOut,
  mail: Mail, menu: Menu, monitoring: ChartColumn, neutral: Info, notifications: Bell,
  park: Network, pause: Pause, person: User, person_add: UserPlus, play_arrow: Play,
  priority_high: CircleAlert, psychology: Target, query_stats: Target, quiz: CircleHelp,
  radio_button_unchecked: Circle, schedule: Clock, school: GraduationCap, send: Send,
  shield: Shield, sm: Circle, speed: Gauge, success: CircleCheck, table_view: Table,
  tag: Hash, task_alt: CircleCheck, terminal: Terminal, timelapse: Clock, timer: Timer,
  tonal: Layers, trending_up: TrendingUp, tune: SlidersHorizontal, unfold_more: ChevronsUpDown,
  upload_file: CloudUpload, verified: ShieldCheck, warning: CircleAlert,
  workspace_premium: ShieldCheck, visibility: Eye, visibility_off: EyeOff,
  alternate_email: Mail, badge: IdCard, calculate: Sigma, account_balance: Landmark,
  dark_mode: Moon, alarm: AlarmClock, power_settings_new: LogOut, menu_book: BookOpen,
  inbox: Inbox, layers: Layers, target: Target, trending_down: TrendingDown,
};
export interface IconProps {
  name: IconName;
  size?: IconSize;
  color?: string;
  label?: string;
  style?: StyleProp<TextStyle>;
}
export function Icon({ name, size = 'md', color = colors.primary, label, style }: IconProps) {
  const Glyph = ICONS[name];
  const dimension = SIZE[size];
  return <View accessible={Boolean(label)} accessibilityLabel={label}
    accessibilityElementsHidden={!label} importantForAccessibility={label ? 'yes' : 'no-hide-descendants'}
    style={[{ width: dimension, height: dimension }, style]}>
    <Glyph size={dimension} color={color} strokeWidth={2} />
  </View>;
}
