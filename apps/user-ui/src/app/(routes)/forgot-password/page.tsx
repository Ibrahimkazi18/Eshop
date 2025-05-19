"use client";

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from 'react-hook-form';
import toast from "react-hot-toast";

type FormData = {
    email: string,
    password: string,
}

const ForgotPassword = () => {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [canResend, setCanResend] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);
  const [serverError, setServerError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const { register, handleSubmit, formState : { errors } } = useForm<FormData>();

  const startResendTimer = () => {
    const interval = setInterval(() => {
        setTimer((prev) => {
            if(prev <= 1) {
                clearInterval(interval);
                setCanResend(true)
                return 0;
            }
            return prev -1;
        })
    }, 1000)
  }

  const requestOtpMutation = useMutation({
    mutationFn: async ({ email } : { email : string }) => {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SEVER_URI}/api/forgot-password-user`, { email });
        return response.data;
    },

    onSuccess: (_, { email }) => {
        setUserEmail(email);
        setStep("otp");
        setServerError(null);
        setCanResend(false);
        startResendTimer();
    },

    onError: (error : AxiosError) => {
        const errMeessage = (error.response?.data as { message ?: string })?.message || "Invalid Credentials.";
        setServerError(errMeessage);
    }
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
        if(!userEmail) {
            return;
        }

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SEVER_URI}/api/verify-forgot-password-user`, 
            {
                email : userEmail, 
                otp : otp.join("") 
            }
        );

        return response.data;
    },

    onSuccess: () => {
        setStep("reset");
        setServerError(null);
    },

    onError: (error : AxiosError) => {
        const errMeessage = (error.response?.data as { message ?: string })?.message || "Invalid Credentials.";
        setServerError(errMeessage);
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ password } : { password : string }) => {
        if(!password) return;

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SEVER_URI}/api/reset-password-user`, 
            {
                email : userEmail, 
                newPassword : password
            }
        );

        return response.data;
    },

    onSuccess: () => {
        setStep("email");
        toast.success("Password reset succesfully! Please login with your new pasword.")
        setServerError(null);
        router.push("/login")
    },

    onError: (error : AxiosError) => {
        const errMeessage = (error.response?.data as { message ?: string })?.message || "Invalid Credentials.";
        setServerError(errMeessage);
    }
  })

  const handleOtpChange = ( index : number, value : string) => {
    if(!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if(value && index < inputRef.current.length - 1) {
        inputRef.current[index+1]?.focus();
    }
  }
  
  const handleOtpKeyDown = ( index : number, e : React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Backspace" && !otp[index] && index > 0) {
        inputRef.current[index-1]?.focus();
    }
  }

  const onSubmitEmail = ( { email }  : { email : string } ) => {
    requestOtpMutation.mutate({ email });
  } 

  const onSubmitPassword = ( { password }  : { password : string } ) => {
    resetPasswordMutation.mutate({ password });
  } 

  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
        <h1 className="text-4xl font-Poppins font-semibold text-black text-center">
            Forgot Password
        </h1>

        <p className="text-center text-lg font-medium py-3 text-[#00000099]">
            Home . Forgot Password
        </p>

        <div className="w-full flex justify-center">
            <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
                { step === "email" && (
                    <>
                        <h3 className="text-3xl font-semibold text-center mb-2">
                            Login to Eshop
                        </h3>

                        <p className="text-center text-gray-500 mb-4">
                            Go Back to {" "}
                            <Link href={"/login"} className="text-blue-500">Login </Link>?
                        </p>

                        <form onSubmit={handleSubmit(onSubmitEmail)}>
                            <label className="text-gray-700 block mb-1">Email</label>
                            <input 
                                type="email" 
                                placeholder="abc@xyz.com" 
                                className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1" 
                                {...register("email", {
                                    required: "Email is required.",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Invalid email address."
                                },
                            })}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm">{String(errors.email.message)}</p>
                            )}

                            <button 
                                type="submit"
                                disabled={requestOtpMutation.isPending}
                                className="w-full mt-4 text-lg cursor-pointer bg-black text-white py-2 rounded-lg"
                            >
                                {requestOtpMutation.isPending ? 'Sending OTP ... ' : 'Submit'}
                            </button>

                            {serverError && (
                                <p className="text-red-500 text-sm">{String(serverError)}</p>
                            )}
                        </form>
                    </>
                )}

                { step === "otp" && (
                    <>
                        <h3 className="text-xl font-semibold text-center mb-4">
                            Enter OTP
                        </h3>

                        <div className="flex justify-center gap-6">
                            {otp.map((digit, index) => (
                                <input 
                                    type="text" 
                                    key={index} 
                                    ref={(el) => {
                                        if(el) inputRef.current[index] = el;
                                    }} 
                                    maxLength={1}
                                    className="w-12 h-12 border text-center border-gray-300 outline-none !rounded"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                />
                            ))}
                        </div>

                        <button 
                            disabled={verifyOtpMutation.isPending}
                            onClick={() => verifyOtpMutation.mutate()}
                            className="w-full mt-4 text-lg cursor-pointer bg-blue-500 text-white py-2 rounded-lg"
                        >
                            {verifyOtpMutation.isPending ? "Verifying OTP ... " : "Verify OTP"}
                        </button>

                        <p className="text-sm text-center mt-4">
                            {canResend ? (
                                <button
                                    onClick={() => requestOtpMutation.mutate({ email : userEmail! })}
                                    className="text-blue-500 cursor-pointer"
                                >
                                    Resend OTP
                                </button>
                            ) : (
                                <button>
                                    Resend OTP in {timer}s
                                </button>
                            )}
                        </p>

                        {
                            serverError && (
                                <p className="text-red-500 text-sm mt-2">
                                    { serverError }
                                </p>
                            )
                        }
                    </>
                )}

                { step === "reset" && (
                    <>
                        <h3 className="text-xl font-semibold text-center mb-4">
                            Reset Password
                        </h3>

                        <form onSubmit={handleSubmit(onSubmitPassword)}>
                            <label className="text-gray-700 block mb-1">New Password</label>

                            <div className="relative">
                                <input 
                                    type={passwordVisible ? "text" : "password"} 
                                    placeholder="Min 6 characters" 
                                    className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1" 
                                    {...register("password", {
                                        required: "Password is required.",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be atleast 6 characters in length."
                                    },
                                })}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setPasswordVisible(!passwordVisible)} 
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                                >
                                    {passwordVisible ? <Eye /> : <EyeOff /> }
                                </button>

                                {errors.password && (
                                    <p className="text-red-500 text-sm">{String(errors.password.message)}</p>
                                )}
                            </div>

                            <button 
                                type="submit"
                                disabled={resetPasswordMutation.isPending}
                                className="w-full bg-black mt-4 cursor-pointer text-center text-white text-lg py-2 rounded-lg"
                            >
                                { resetPasswordMutation.isPending ? "resetting ... " : "Reset Password" }
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    </div>
  )
}

export default ForgotPassword