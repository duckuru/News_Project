import { useState } from "react";
import { Link } from "react-router"; // use react-router-dom instead of react-router
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Label } from "../ui/label";

export default function Navbar() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="sticky top-0 z-50 w-screen bg-[#f3f3f3] px-8 shadow-md h-24 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-[#333] ml-8">
        News App
      </Link>

      {/* Search */}
      <div className="flex gap-4 items-center">
        <Input placeholder="Search for news" className="w-[25rem] h-12 border-2" />
        <Select>
          <SelectTrigger className="w-[12rem] border-2 h-12">
            <SelectValue placeholder="Select a Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button className="bg-[#f3f3f3] hover:bg-[#e1e1e1] border-2 h-12 w-12">
          <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#3f3f3f" }} />
        </Button>
      </div>

      {/* Auth Dialog (Login/Signup toggle) */}
      <span className="auth-btn">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="text-xl px-6 py-3 mr-3" onClick={() => setIsLogin(true)}>
              Login
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-center text-3xl">
                {isLogin ? "Login" : "Sign Up"}
              </DialogTitle>
            </DialogHeader>

            <form className="text-[#3f3f3f] grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Username</Label>
                <Input id="name" name="name" type="text" />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" />
              </div>

              {!isLogin && (
                <div className="grid gap-3">
                  <Label htmlFor="c-password">Confirm Password</Label>
                  <Input id="c-password" name="c-password" type="password" />
                </div>
              )}

              <DialogFooter className="grid gap-2 w-full">
                <Button type="submit" className="w-full py-3">
                  {isLogin ? "Login" : "Register"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-sm"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin
                    ? "Don't have an account? Sign Up"
                    : "Already have an account? Login"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* sign up button   */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="text-xl px-6 py-3" onClick={() => setIsLogin(false)}>
              Sign up
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-center text-3xl">
                {isLogin ? "Login" : "Sign Up"}
              </DialogTitle>
            </DialogHeader>

            <form className="text-[#3f3f3f] grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Username</Label>
                <Input id="name" name="name" type="text" />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" />
              </div>

              {!isLogin && (
                <div className="grid gap-3">
                  <Label htmlFor="c-password">Confirm Password</Label>
                  <Input id="c-password" name="c-password" type="password" />
                </div>
              )}

              <DialogFooter className="grid gap-2 w-full">
                <Button type="submit" className="w-full py-3">
                  {isLogin ? "Login" : "Register"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-sm"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin
                    ? "Don't have an account? Sign Up"
                    : "Already have an account? Login"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* profile btn placeholder */}
      </span>
      <Link to='/profile'>
        <img src="/vite.svg" alt="" className="border border-black rounded-full p-2" />
      </Link>
    </div>
  );
}
