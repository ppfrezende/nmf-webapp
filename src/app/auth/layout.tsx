import Image from 'next/image'
import logo from '../../../public/logo.svg'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 md:max-w-3xl">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <Image
            className="size-12 items-center justify-center rounded-md bg-secondary"
            src={logo}
            alt="logo"
          />
          no-more-failures.
        </a>
        {children}
      </div>
    </div>
  )
}
