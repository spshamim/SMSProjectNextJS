"use client";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function Page() {
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [balance, setBalance] = useState(0);

    const checkBalance = async () => {
        const RR = await axios.get(`${process.env.NEXT_PUBLIC_SMS_Aggregator}/api/getBalanceApi?api_key=${process.env.NEXT_PUBLIC_SMS_API_KEY}`);
        setBalance(RR.data.balance);
    }

    const submitSMSForm = async (data:any) => {
        let phone = data.phone;
        let message = data.message;
        let encodedMessage = encodeURIComponent(message);

        try {
            const RR = await axios.post(`${process.env.NEXT_PUBLIC_SMS_Aggregator}/api/smsapi?api_key=${process.env.NEXT_PUBLIC_SMS_API_KEY}&type=text&number=${phone}&senderid=8809617621615&message=${encodedMessage}`);
            if (RR.data.response_code === 202) {
                toast({
                    variant: "success",
                    title: "Sent Success.",
                    description: `SMS has been sent successfully to ${phone}.`,
                });
                reset();
            } else {
                toast({
                    variant: "logout",
                    title: "Sent Failed.",
                    description: [`Failed to send SMS to ${phone}.`, `Error: ${RR.data.error_message}.`],
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Sent Failed.",
                description: [`Failed to send SMS to ${phone}.`, `Error: ${error}.`],
            });
        }
    };

    return (
        <div className="flex flex-col items-center px-4 sm:px-8">
            <h1 className="text-red-700 font-bold text-3xl sm:text-4xl text-center">SMS Portal</h1>
            <hr className="my-4 w-full max-w-sm" />

            {/* Dialog View Area */}
            <Dialog>
                <DialogTrigger asChild>
                    <button
                        type="button"
                        className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm sm:text-base px-4 py-2.5 sm:px-5 mb-4 w-full sm:w-auto"
                        onClick={checkBalance}
                    >
                        Check Balance
                    </button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-xs sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl sm:text-3xl text-purple-800 font-bold text-center">
                            Your account balance is:
                        </DialogTitle>
                        <div className="bg-gray-200 text-black text-lg sm:text-2xl font-semibold p-4 rounded-lg shadow-md text-center">
                            {balance} Taka
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            {/* Dialog SEND SMS Area */}
            <Dialog>
                <DialogTrigger asChild>
                    <button
                        type="button"
                        className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm sm:text-base px-4 py-2.5 sm:px-5 mb-4 w-full sm:w-auto"
                    >
                        Send SMS
                    </button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-xs sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl sm:text-3xl text-purple-800 font-bold text-center">
                            SEND SMS
                        </DialogTitle>
                        <div className="bg-gray-200 text-black p-4 rounded-lg shadow-md">
                            <form onSubmit={handleSubmit(submitSMSForm)}>
                                <div className="grid gap-4">
                                    {/* Phone Number */}
                                    <div>
                                        <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                                        <input
                                            {...register("phone", { required: "Phone is required" })}
                                            type="text"
                                            placeholder="Type your Phone"
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600 text-sm sm:text-base"
                                        />
                                        {errors.phone && typeof errors.phone.message === "string" && (
                                        <span className="text-red-700 text-xs sm:text-sm font-bold">
                                            {errors.phone.message}
                                        </span>
                                        )}
                                    </div>

                                    {/* SMS */}
                                    <div>
                                        <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                                        <textarea
                                            {...register("message", { required: "Message is required" })}
                                            placeholder="Type your message"
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600 text-sm sm:text-base"
                                            rows={5}
                                        />
                                        {errors.message && typeof errors.message.message === "string" && (
                                        <span className="text-red-700 text-xs sm:text-sm font-bold">
                                            {errors.message.message}
                                        </span>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center mt-4">
                                    <button
                                        type="submit"
                                        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg font-medium rounded-lg text-sm sm:text-base px-16 py-2.5"
                                    >
                                        Send
                                    </button>
                                </div>
                            </form>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}
