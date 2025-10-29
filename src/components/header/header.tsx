import { ProfileButton } from './profile-button'
import { Separator } from '../ui/separator'
import { ThemeSwitcher } from '../theme/theme-switcher'

export function Header() {
  return (
    // <div className="mx-auto flex max-w-full items-center justify-between">
    <div className="flex items-center gap-4">
      <ThemeSwitcher />
      <Separator orientation="vertical" className="h-5" />
      <ProfileButton />
    </div>
    // </div>
  )
}
