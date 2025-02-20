"use client"

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AccountSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Personal Information Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Personal Information</h2>
            <p className="text-sm text-gray-500">Update your personal details.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/path/to/profile-pic.jpg" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <Button variant="outline">Change Photo</Button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <Input defaultValue="John Doe" className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <Input defaultValue="john.doe@example.com" className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <Input defaultValue="I love coding!" className="mt-1" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>

        {/* Security Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Security</h2>
            <p className="text-sm text-gray-500">Manage your account security.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Change Password</label>
              <Input type="password" placeholder="New Password" className="mt-1" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Preferences</h2>
            <p className="text-sm text-gray-500">Customize your experience.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Language</label>
              <Input defaultValue="English" className="mt-1" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Dark Mode</p>
                <p className="text-sm text-gray-500">Toggle dark theme.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Integrations Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Integrations</h2>
            <p className="text-sm text-gray-500">Connect your accounts.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">GitHub</p>
                <p className="text-sm text-gray-500">Connected as @john-doe</p>
              </div>
              <Button variant="destructive">Disconnect</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Google</p>
                <p className="text-sm text-gray-500">Not connected</p>
              </div>
              <Button>Connect</Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone Section */}
        <Card className="border-red-500">
          <CardHeader>
            <h2 className="text-xl font-bold text-red-500">Danger Zone</h2>
            <p className="text-sm text-gray-500">Irreversible actions.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Deactivate Account</p>
                <p className="text-sm text-gray-500">Temporarily disable your account.</p>
              </div>
              <Button variant="destructive">Deactivate</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Delete Account</p>
                <p className="text-sm text-gray-500">Permanently delete your account.</p>
              </div>
              <Button variant="destructive">Delete</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}