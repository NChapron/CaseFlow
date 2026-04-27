import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';

export type AvatarSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'cf-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
})
export class AvatarComponent {
  readonly initials = input.required<string>();
  readonly name = input<string | null>(null);
  readonly size = input<AvatarSize>('sm');
  readonly sizeClass = computed(() => `avatar--${this.size()}`);
}
