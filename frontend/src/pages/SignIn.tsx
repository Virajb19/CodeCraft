import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignInSchema } from '../lib/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form'
import { Loader } from 'lucide-react'
import { motion } from 'framer-motion'
import { DemarcationLine } from '../components/auth/social-auth'
import PasswordInput from '../components/auth/PasswordInput'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import axios from '../lib/utils'
import { toast } from 'sonner'
import { AxiosError } from 'axios'

type SignInData = z.infer<typeof SignInSchema>

export default function SignIn() {

  const navigate = useNavigate()

  const form = useForm<SignInData>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: '', password: ''}
  })

  const signin = useMutation({
    mutationFn: async (data: SignInData) => {
       const res = await axios.post('/api/user/signin', data)
       return res.data
    },
  })

  async function onSubmit(data: SignInData) {
    await signin.mutateAsync(data, {
      onSuccess: () => {
        toast.success('Logged in successfully!.Welcome back')
        navigate('/')
      },
      onError: (err) => {
        console.error(err)
        if(err instanceof AxiosError) {
          toast.error(err.response?.data.msg || 'Something went wrong')
        } else toast.error('Something went wrong')
      }
    })
  }

  return <div className="w-full min-h-screen flex-center pt-20 text-lg">

    <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{duration: 0.7, ease: 'easeInOut', type: 'spring', damping: '10'}} 
    className='w-[90%] sm:w-1/3 max-w-3xl z-30'>
              <Card className='shadow-lg shadow-blue-700'>
                <CardHeader className='text-center'>
                   <CardTitle className='text-4xl sm:text-5xl'>Welcome Back</CardTitle>
                   <CardDescription className='sm:text-base'>Please enter your details to signin</CardDescription>
                </CardHeader>
                <CardContent>
                     <Form {...form}>
                        <form className='space-y-3 w-full' onSubmit={form.handleSubmit(onSubmit)}>
                           
                        <FormField
                          control={form.control}
                          name='email'
                          render={({ field }) => (
                             <FormItem className='flex flex-col gap-1'>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <input className='input-style' placeholder='name@gmail.com' {...field}/>
                              </FormControl>
                              <FormMessage />
                             </FormItem>
                          )}
                        />

                       <FormField
                          control={form.control}
                          name='password'
                          render={({ field }) => (
                             <FormItem className='flex flex-col gap-1'>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <PasswordInput placeholder='password' field={field}/>
                              </FormControl>
                              <FormMessage />
                             </FormItem>
                          )}
                        />

                        <motion.button whileHover={form.formState.isSubmitting ? {opacity: 0.5} : {opacity: 0.8}} 
                          className='rounded-full font-bold cursor-pointer flex-center gap-2 w-full px-5 py-1 text-lg bg-black text-white dark:bg-white dark:text-black disabled:opacity-50 disabled:cursor-not-allowed'
                          disabled={form.formState.isSubmitting} type='submit'> 
                         {form.formState.isSubmitting && <Loader className='animate-spin'/>} {form.formState.isSubmitting ? 'Please wait...' : 'Login'}
                        </motion.button>

                        <DemarcationLine />
                        <div className='flex mb:flex-col items-center gap-1'>
                          </div>

                        </form>
                     </Form>

                     <div className="flex items-center justify-center mt-6 text-sm sm:text-lg">
                        <span className="text-muted-foreground">
                          Don&apos;t have an account yet?{' '}
                          <Link
                            to={'/signup'}
                            className="text-blue-500 font-semibold hover:underline"
                          >
                            Sign Up
                          </Link>
                        </span>
                      </div>
                </CardContent>
              </Card>
          </motion.div>
  </div>
} 