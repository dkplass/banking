"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createTransfer } from "@/lib/actions/dwolla.actions";
import { createTransaction } from "@/lib/actions/transaction.actions";
import { getBank, getBankByAccountId } from "@/lib/actions/user.actions";
import { decryptId } from "@/lib/utils";

import BankDropdown from "./BankDropdown";
import { Button } from "./ui/button";
import { Form, FormDescription, FormLabel } from "./ui/form";
import CustomInput from "./CustomInput";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(4, "Transfer note is too short"),
  amount: z.string().min(4, "Amount is too short"),
  senderBank: z.string().min(4, "Please select a valid bank account"),
  sharableId: z.string().min(8, "Please select a valid sharable Id"),
});

const PaymentTransferForm = ({ accounts }: PaymentTransferFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "",
      senderBank: "",
      sharableId: "",
    },
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const receiverAccountId = decryptId(data.sharableId);
      const receiverBank = await getBankByAccountId({
        accountId: receiverAccountId,
      });
      const senderBank = await getBank({ documentId: data.senderBank });
      const transferParams = {
        sourceFundingSourceUrl: senderBank.fundingSourceUrl,
        destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
        amount: data.amount,
      };
      // create transfer
      const transfer = await createTransfer(transferParams);

      // create transfer transaction
      if (transfer) {
        const transaction = {
          name: data.name,
          amount: data.amount,
          senderId: senderBank.userId.$id,
          senderBankId: senderBank.$id,
          receiverId: receiverBank.userId.$id,
          receiverBankId: receiverBank.$id,
          email: data.email,
        };

        const newTransaction = await createTransaction(transaction);

        if (newTransaction) {
          form.reset();
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Submitting create transfer request failed: ", error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
        <CustomInput
          control={form.control}
          name="senderBank"
          labelSlot={
            <div className="payment-transfer_form-content">
              <FormLabel className="text-14 font-medium text-gray-700">
                Select Source Bank
              </FormLabel>
              <FormDescription className="text-12 font-normal text-gray-600">
                Select the bank account you want to transfer funds from
              </FormDescription>
            </div>
          }
          inputSlot={
            <BankDropdown
              accounts={accounts}
              setValue={form.setValue}
              otherStyles="!w-full"
            />
          }
          itemClass="payment-transfer_form-item pb-6 pt-5"
          labelClass="text-14 w-full max-w-[280px] font-medium text-gray-700"
        />

        <CustomInput
          control={form.control}
          name="name"
          type="textarea"
          labelSlot={
            <div className="payment-transfer_form-content">
              <FormLabel className="text-14 font-medium text-gray-700">
                Transfer Note (Optional)
              </FormLabel>
              <FormDescription className="text-12 font-normal text-gray-600">
                Please provide any additional information or instructions
                related to the transfer
              </FormDescription>
            </div>
          }
          placeholder="Write a short note here"
          itemClass="payment-transfer_form-item py-5"
          labelClass="text-14 w-full max-w-[280px] font-medium text-gray-700"
        />

        <div className="payment-transfer_form-details">
          <h2 className="text-18 font-semibold text-gray-900">
            Bank account details
          </h2>
          <p className="text-16 font-normal text-gray-600">
            Enter the bank account details of the recipient
          </p>
        </div>

        <CustomInput
          control={form.control}
          name="email"
          type="text"
          label="Recipient's Email Address"
          placeholder="ex: hans@gmail.com"
          itemClass="payment-transfer_form-item py-5"
          labelClass="text-14 w-full max-w-[280px] font-medium text-gray-700"
        />

        <CustomInput
          control={form.control}
          name="sharableId"
          type="text"
          label="Receiver's Plaid Sharable Id"
          placeholder="Enter the public account number"
          itemClass="payment-transfer_form-item py-5"
          labelClass="text-14 w-full max-w-[280px] font-medium text-gray-700"
        />

        <CustomInput
          control={form.control}
          name="amount"
          type="text"
          label="Amount"
          placeholder="ex: 5.00"
          itemClass="payment-transfer_form-item pb-5 pt-6"
          labelClass="text-14 w-full max-w-[280px] font-medium text-gray-700"
        />

        <div className="payment-transfer_btn-box">
          <Button type="submit" className="payment-transfer_btn">
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp; Sending...
              </>
            ) : (
              "Transfer Funds"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentTransferForm;
