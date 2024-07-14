"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Google } from "@mui/icons-material";
import { Button, Checkbox, Divider, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Cookies from "js-cookie";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  rememberMe: z.boolean().optional(),
  password: z
    .string()
    .min(4, { message: "Password must be at least 8 characters" }),
});

type Credentials = z.infer<typeof credentialsSchema>;

export default function Home() {
  const router = useRouter();
  const [invalidUser, setInvalidUser] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<Credentials>({
    resolver: zodResolver(credentialsSchema),
  });

  const [isLoginPending, setIsLoginPending] = useState(false);

  const formHandler = async (data: Credentials) => {
    setIsLoginPending(true);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
      rememberMe: data.rememberMe ? "true" : "false",
    }).then((res) => {
      setIsLoginPending(false);
      return res;
    });

    if (result && !result.ok) {
      setInvalidUser(true);
      return;
    }

    Cookies.set("rememberMe", data.rememberMe ? "true" : "false");

    router.replace("/dashboard");
  };

  const handleInputChange = () => {
    if (invalidUser) setInvalidUser(false);
  };

  return (
    <main className="flex min-h-screen flex-col p-24 items-center">
      <Box component="section" className="flex gap-10 flex-col w-full max-w-md">
        <form
          onSubmit={handleSubmit(formHandler)}
          className="flex w-full gap-8 flex-col"
        >
          <Typography variant="h4" component="h1" fontWeight={"300"}>
            Login
          </Typography>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 w-full">
              <Typography variant="subtitle1" component="h1" fontWeight={"300"}>
                Email address
              </Typography>
              <input
                {...register("email", { onChange: handleInputChange })}
                className={`w-full border-stone-200 border-solid border-[1px] rounded-md p-3 ${
                  invalidUser && "border-red-300"
                }`}
                placeholder="exemple@mail.com"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Typography variant="subtitle1" component="h1" fontWeight={"300"}>
                Password
              </Typography>
              <input
                {...register("password", { onChange: handleInputChange })}
                type="password"
                className={`w-full border-stone-200 border-solid border-[1px] rounded-md p-3 ${
                  invalidUser && "border-red-300"
                }`}
                placeholder="***********"
              />
            </div>
            <div className="flex flex-row items-center">
              <Checkbox
                className="w-fit"
                id="remember-me"
                {...register("rememberMe")}
              />
              <label className="cursor-pointer" htmlFor="remember-me">
                Remember me
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {errors && (
              <Typography
                variant="subtitle2"
                component="h1"
                fontWeight={"300"}
                color={"red"}
              >
                {errors.email?.message || errors.password?.message}
              </Typography>
            )}
            <Button
              variant="contained"
              className="rounded-md h-10"
              type="submit"
            >
              <span className="flex justify-center items-center">
                {isLoginPending ? (
                  <CircularProgress size={25} color="inherit" />
                ) : (
                  "Login"
                )}
              </span>
            </Button>
            <Typography variant="subtitle1" component="h1" fontWeight={"300"}>
              Don&apos;t have an account?{" "}
              <a href="#" className="text-[#1976D2]">
                Sign up
              </a>
            </Typography>
          </div>
          <Divider className="font-extralight text-stone-400">or</Divider>
          <Button variant="outlined" className="flex rounded-md gap-2 w-full">
            <Google />
            <span>Authorize with Google</span>
          </Button>
        </form>
      </Box>
    </main>
  );
}
