import React, { useState } from 'react'
import authservice from '../appwrite/auth'
import { login as storeLogin } from '../feature/authSlice'
import { useDispatch } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Button, Logo } from './index'

function LoginForm() {
    const [error, setError] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { register, handleSubmit } = useForm()
    const from = location.state?.from?.pathname || "/"

    const loginHandler = async (data) => {
        setError('')
        try {
            const session = await authservice.logIn(data)
            if (session) {
                const userData = await authservice.getCurrentUser()
                if (userData) dispatch(storeLogin(userData))
                navigate(from, { replace: true })
            }
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <form onSubmit={handleSubmit(loginHandler)}>
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your credentials below to log in to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                className="w-full"
                                {...register("email", {
                                    required: true,
                                    validate: {
                                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                            "Email address must be a valid address",
                                    }
                                })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link to='#' className="ml-auto inline-block text-sm underline">
                                    Forgot your password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                className="w-full"
                                {...register("password", { required: true })}
                            />
                        </div>
                        <Button
                            type="submit"
                            className=""
                            variant=""
                        >
                            Sign in
                        </Button>
                        {/* <Button variant="" className="w-full">
                            Login with Google
                        </Button> */}
                    </div>
                    {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link to='/signup' className="underline text-primary">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}

export default LoginForm
