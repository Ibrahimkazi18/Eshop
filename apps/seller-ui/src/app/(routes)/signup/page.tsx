"use client";

import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from 'react-hook-form';
import axios, {AxiosError} from "axios";
import { countries } from "apps/seller-ui/src/config/constants";
import Link from "next/link";

const Signup = () => {
  const [activeStep, setActiveStep] = useState(1);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [sellerData, setSellerData] = useState<FormData | null>(null);
  const [sellerId, setSellerId] = useState("");
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const { register, handleSubmit, formState : { errors } } = useForm();

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

  const signupMutation = useMutation({
    mutationFn: async (data:FormData) => {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SEVER_URI}/api/seller-registration`, data);
        return response.data;
    },
    onSuccess: (_, formData) => {
        setSellerData(formData);
        setShowOtp(true);
        setCanResend(false);
        setTimer(60);
        startResendTimer();
    }
  })

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
        if(!sellerData) {
            return;
        }

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SEVER_URI}/api/verify-seller`, 
            {
                ...sellerData, 
                otp: otp.join("")
            }
        );

        return response.data;
    },

    onSuccess: (data) => {
        setSellerId(data?.seller?.id);
        setActiveStep(2);
    }
  })

  const onSubmit = ( data  : any ) => {
    signupMutation.mutate(data);
  } 

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

  const resendOtp = () => {
    if(sellerData) {
        signupMutation.mutate(sellerData);
    }
  }

  return (
    <div className="w-full flex flex-col items-center pt-10 min-h-screen">
      {/* Stepper */}
      <div className="relative flex items-center justify-between md:w-[50%] mb-8">
        <div className="absolute top-[25%] left-0 w-[80%] md:w-[90%] h-1 bg-gray-300 -z-10" />

        { [1,2,3].map((step) => (
          <div key={step}>
            <div className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${step <= activeStep ? 'bg-blue-600' : 'bg-gray-300'}`}>
              {step}
            </div>
            <span className="ml-[-15px]">
              { step === 1 ? 'Create Account' : step === 2 ? 'Setup Shop' : 'Connect Bank' }
            </span>
          </div>
        )) }
      </div>

      {/* Steps content */}
      <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
        { activeStep === 1 && (
          <>
            {!showOtp ? 
                    (
                    <>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <h3 className="text-2xl font-semibold text-center mb-4 font-poppins">
                            Create An Account
                          </h3>
                          <label className="text-gray-700 block mb-1">Name</label>
                          <input 
                              type="text" 
                              placeholder="John doe" 
                              className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1" 
                              {...register("name", {
                                  required: "Name is required.",
                              })}
                          />
                          {errors.name && (
                              <p className="text-red-500 text-sm">{String(errors.name.message)}</p>
                          )}

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

                          <label className="text-gray-700 block mb-1">Phone Number</label>
                          <input 
                              type="tel" 
                              placeholder="846123****" 
                              className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1" 
                              {...register("phone_number", {
                                  required: "Phone Number is required.",
                                  pattern: {
                                    value: /^\+?[1-9]\d{1,14}$/,          // E.164 format
                                    message: "Invalid phone number format"
                                  },
                                  minLength: {
                                    value: 10,
                                    message: 'Phone number must be atleast 10 digits',
                                  }
                              })}
                          />
                          {errors.phone_number && (
                              <p className="text-red-500 text-sm">{String(errors.phone_number.message)}</p>
                          )}

                          <label className="text-gray-700 block mb-1">Country</label>
                          <select 
                            className="w-full p-2 border border-gray-300 outline-0 rounded-[4px]"
                            {...register("country", {
                              required: 'Country is required'
                            })}
                          >
                            <option value="">Select your Country</option>
                            {countries.map((country) => (
                              <option value={country.code} key={country.code}>
                                {country.name}
                              </option>
                            ))}
                          </select>

                          {errors.email && (
                              <p className="text-red-500 text-sm">{String(errors.email.message)}</p>
                          )}

                          <label className="text-gray-700 block mb-1">Password</label>
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
                              disabled={signupMutation.isPending}
                              className="w-full mt-4 text-lg cursor-pointer bg-black text-white py-2 rounded-lg"
                          >
                              {signupMutation.isPending ? " Signing up ... "  : " Sign Up "}
                          </button>

                          <p className="text-center text-gray-500 mt-4">
                              Already have an account? {" "}
                              <Link href={"/login"} className="text-blue-500">Login</Link>
                          </p>

                          {signupMutation.isError && (
                            signupMutation.error instanceof AxiosError && (
                              <p className="text-red-500 text-sm mt-2">
                                {signupMutation.error.response?.data?.message || signupMutation.error.message}
                              </p>
                            )
                          )}
                        </form>
                    </>
                    )
                :
                    (
                        <div>
                            <h3 className="text-xl font-semibold text-center mb-4">Enter OTP</h3>

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
                                        onClick={resendOtp}
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
                                verifyOtpMutation.isError && 
                                verifyOtpMutation.error instanceof AxiosError && (
                                    <p className="text-red-500 text-sm mt-2">
                                        { verifyOtpMutation.error.response?.data?.message || verifyOtpMutation.error.message }
                                    </p>
                                )
                            }
                        </div>
                    )
                }
          </>
        ) }
      </div>

    </div>
  )
}

export default Signup