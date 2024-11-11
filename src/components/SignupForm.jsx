import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Button } from './index' 
import authservice from '../appwrite/auth'
import { login as storeLogin } from '../feature/authSlice'

function SignupForm() {
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false) // Added loading state to track form submission status
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSignup = async (data) => {
        setError('')
        setLoading(true) // Set loading to true when form submission starts
        try {
            const session = await authservice.signUp(data)
            if (session) {
                const userData = await authservice.getCurrentUser()
                if (userData) dispatch(storeLogin(userData))
                navigate('/')
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false) // Set loading to false once submission is complete (success or error)
        }
    }

    return (
        <form onSubmit={handleSubmit(handleSignup)}>
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                    <CardDescription>
                        Enter your details below to create a new account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                                className="w-full"
                                {...register("name", { required: true })}
                            />
                        </div>
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
                                        matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                            "Email address must be a valid address",
                                    }
                                })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
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
                            disabled={loading} // Disable button while loading is true
                        >
                            {loading ? "Signing up..." : "Sign up"} {/* Show spinner text if loading */}
                        </Button>
                    </div>
                    {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link to='/login' className="underline text-primary">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}

export default SignupForm
