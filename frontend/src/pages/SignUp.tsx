import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignUpSchema } from '../lib/zod'
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

type SignUpData = z.infer<typeof SignUpSchema>

export default function SignUp() {

  const navigate = useNavigate()

  const form = useForm<SignUpData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { username: '', email: '', password: ''}
  })

  const signup = useMutation({
    mutationFn: async (data: SignUpData) => {
       const res = await axios.post('/api/user/signup', data)
       return res.data
    },
    onSuccess: () => {
      toast.success('Signed up successfully')
      navigate('/signin')
    },
    onError: (err) => {
      console.error(err)
      if(err instanceof AxiosError) {
        toast.error(err.response?.data.msg || 'Something went wrong')
      } else toast.error('Something went wrong')
    }
  })

  async function onSubmit(data: SignUpData) {
      await signup.mutateAsync(data)
  }
  return <div className="w-full min-h-screen flex-center pt-24 pb-5 text-lg">

    <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{duration: 0.7, ease: 'easeInOut', type: 'spring', damping: '10'}} 
    className='w-[90%] lg:w-1/3 sm:w-[70%] max-w-3xl z-30'>
              <Card className='shadow-lg shadow-blue-700'>
                <CardHeader className='text-center'>
                   <CardTitle className='text-[1.8rem] sm:text-5xl'>
                    Welcome to <span className='bg-gradient-to-r from-blue-600 to-purple-700 text-transparent bg-clip-text'>CodeCraft</span>
                    </CardTitle>
                   <CardDescription className='sm:text-base'>Please enter your details to signup</CardDescription>
                </CardHeader>
                <CardContent>
                     <Form {...form}>
                        <form className='space-y-3 w-full' onSubmit={form.handleSubmit(onSubmit)}>

                        <FormField
                          control={form.control}
                          name='username'
                          render={({ field }) => (
                             <FormItem className='flex flex-col gap-1'>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <input className='input-style' placeholder='Enter your username' {...field}/>
                              </FormControl>
                              <FormMessage />
                             </FormItem>
                          )}
                        />
                           
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

                        <motion.button whileHover={form.formState.isSubmitting ? {opacity: 0.5} : {opacity: 0.7}}
                          className='mx-auto rounded-full font-semibold cursor-pointer flex items-center gap-2 w-full flex-center px-6 py-1 text-lg bg-black text-white dark:bg-white dark:text-black disabled:cursor-not-allowed disabled:opacity-75'
                          disabled={form.formState.isSubmitting} type='submit'> 
                         {form.formState.isSubmitting && <Loader className='animate-spin'/>} {form.formState.isSubmitting ? 'Please wait...' : 'Sign up'}
                        </motion.button>

                        <DemarcationLine />
                        <div className='flex mb:flex-col items-center gap-1'>
                          </div>

                        </form>
                     </Form>

                     <div className="flex items-center justify-center mt-2 text-sm sm:text-lg">
                        <span className="text-muted-foreground">
                          Already have an account?{' '}
                          <Link
                            to={'/signin'}
                            className="text-blue-500 font-semibold hover:underline"
                          >
                            Sign In
                          </Link>
                        </span>
                      </div>
                </CardContent>
              </Card>
          </motion.div>
  </div>
} 