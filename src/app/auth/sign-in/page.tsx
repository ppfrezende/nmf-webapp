'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import { z } from 'zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useContext, useState } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { Eye, EyeOff, LoaderIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import rightImageLogin from '../../../../public/rightImageLogin.jpg'

interface SignInFormData {
  email: string
  password: string
}
const authenticateBodySchema = z.object({
  email: z.string().email({ message: 'Digite um e-mail válido' }),
  password: z.string().min(6, { message: 'Min. 6 dígitos' }),
})

export default function SignInPage() {
  const {
    signIn,
    isInvalidCredentials,
    setIsInvalidCredentials,
    isServerConnectionRefused,
    setIsServerConnectionRefused,
  } = useContext(AuthContext)

  const { handleSubmit, register, formState } = useForm<SignInFormData>({
    resolver: zodResolver(authenticateBodySchema),
  })

  const { isSubmitting, errors } = formState

  const [showPassword, setShowPassword] = useState(false)
  const handleShowPassword = () => setShowPassword(!showPassword)

  const handleSignIn: SubmitHandler<SignInFormData> = async (values) => {
    await signIn(values)
  }
  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(handleSignIn)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  onFocus={() => {
                    setIsInvalidCredentials(false)
                    setIsServerConnectionRefused(false)
                  }}
                  {...register('email')}
                  placeholder="m@exemplo.com.br"
                  name="email"
                  type="email"
                  id="email"
                />
                {errors.email && (
                  <div>
                    <p className="text-xs text-destructive">
                      {errors?.email?.message?.toString()}
                    </p>
                  </div>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Esqueci minha senha
                  </a>
                </div>
                <div className="relative w-full max-w-sm">
                  <Input
                    onFocus={() => {
                      setIsInvalidCredentials(false)
                      setIsServerConnectionRefused(false)
                    }}
                    {...register('password')}
                    placeholder="Digite sua senha"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleShowPassword}
                    className="absolute right-0 top-1/2 -translate-y-1/2 hover:bg-transparent"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                </div>
                {errors.password && (
                  <div>
                    <p className="text-xs text-destructive">
                      {errors?.password?.message?.toString()}
                    </p>
                  </div>
                )}
              </div>
              {isInvalidCredentials && (
                <p className="text-xs text-destructive">
                  Credenciais invalidas!
                </p>
              )}
              {isServerConnectionRefused && (
                <p className="text-xs text-destructive">
                  Estamos com problemas. Aguarde alguns instantes...
                </p>
              )}
              <Separator />
              {isSubmitting ? (
                <Button className="w-full" disabled>
                  <LoaderIcon className="animate-spin" />
                </Button>
              ) : (
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
              )}
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-card px-2 text-muted-foreground">
                  Ou continue com o Google
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <Button variant="outline" type="button" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Google</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                Não tem uma conta?{' '}
                <a href="#" className="underline underline-offset-4">
                  Criar conta
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src={rightImageLogin}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.7]"
            />
          </div>
        </CardContent>
      </Card>
      <div className="*:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4 text-balance text-center text-xs text-muted-foreground">
        Ao clicar em continuar, você concorda com os{' '}
        <a href="#">Termos de Serviço</a> e{' '}
        <a href="#">Políticas de Privacidade</a>.
      </div>
    </div>
  )
}
