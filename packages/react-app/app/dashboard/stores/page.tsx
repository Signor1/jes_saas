"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Edit,
  ExternalLink,
  Globe,
  Home,
  Loader2,
  Package,
  Plus,
  Settings,
  ShoppingCart,
  Trash2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import Image from "next/image";

interface Store {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  isActive: boolean;
  createdAt: string;
}

export default function StoresPage() {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStore, setNewStore] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    // In a real app, this would be an API call to fetch stores
    // For demo purposes, we'll use localStorage
    const fetchStores = () => {
      const storedStores = localStorage.getItem("stores");
      if (storedStores) {
        setStores(JSON.parse(storedStores));
      }
      setIsLoading(false);
    };

    fetchStores();
  }, []);

  const handleCreateStore = async () => {
    setIsCreating(true);

    try {
      // In a real app, this would be an API call to create a store
      // For demo purposes, we'll update localStorage
      const newStoreData: Store = {
        id: "store_" + Math.random().toString(36).substring(2, 9),
        name: newStore.name,
        slug: newStore.name.toLowerCase().replace(/\s+/g, "-"),
        description:
          newStore.description ||
          "Welcome to my store. Find great products at amazing prices!",
        logo: "/placeholder.svg?height=80&width=80",
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      const updatedStores = [...stores, newStoreData];
      setStores(updatedStores);
      localStorage.setItem("stores", JSON.stringify(updatedStores));

      toast.success("Store created!");

      setNewStore({ name: "", description: "" });
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("There was an error creating your store. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const toggleStoreStatus = (storeId: string) => {
    const updatedStores = stores.map((store) =>
      store.id === storeId ? { ...store, isActive: !store.isActive } : store
    );
    setStores(updatedStores);
    localStorage.setItem("stores", JSON.stringify(updatedStores));

    const store = updatedStores.find((s) => s.id === storeId);
    toast.success(store?.isActive ? "Store activated" : "Store deactivated");
  };

  const deleteStore = (storeId: string) => {
    const storeToDelete = stores.find((store) => store.id === storeId);
    const updatedStores = stores.filter((store) => store.id !== storeId);
    setStores(updatedStores);
    localStorage.setItem("stores", JSON.stringify(updatedStores));

    toast.error("Store deleted");
  };

  const copyStoreUrl = (slug: string) => {
    const url = `${window.location.origin}/store/${slug}`;
    navigator.clipboard.writeText(url);
    toast("URL copied!");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex  flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:px-6">
          <Link href="/dashboard" className="lg:hidden">
            <CreditCard className="h-6 w-6" />
            <span className="sr-only">Dashboard</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="font-semibold text-lg">Your Stores</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Store
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new store</DialogTitle>
                <DialogDescription>
                  Create a new storefront to sell your products. You can
                  customize it later.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Store Name</Label>
                  <Input
                    id="name"
                    placeholder="My Awesome Store"
                    value={newStore.name}
                    onChange={(e) =>
                      setNewStore({ ...newStore, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Store Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your store..."
                    value={newStore.description}
                    onChange={(e) =>
                      setNewStore({ ...newStore, description: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateStore}
                  disabled={!newStore.name || isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Store"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {isLoading ? (
            <div className="flex h-[200px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : stores.length === 0 ? (
            <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <Globe className="h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-lg font-medium">No stores yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Create your first store to start selling products with MiniPay.
              </p>
              <Button className="mt-6" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Store
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stores.map((store) => (
                <Card key={store.id} className="overflow-hidden">
                  <CardHeader className="border-b p-0">
                    <div className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 overflow-hidden rounded-md bg-muted">
                          <Image
                            src={store.logo || "/placeholder.svg"}
                            alt={store.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {store.name}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            Created{" "}
                            {new Date(store.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={store.isActive ? "default" : "outline"}>
                        {store.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium">Store URL</h3>
                        <div className="mt-1 flex items-center gap-2">
                          <code className="rounded bg-muted px-2 py-1 text-xs">
                            {window.location.origin}/store/{store.slug}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => copyStoreUrl(store.slug)}
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">Copy URL</span>
                          </Button>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Store Status</h3>
                        <div className="mt-2 flex items-center gap-2">
                          <Switch
                            checked={store.isActive}
                            onCheckedChange={() => toggleStoreStatus(store.id)}
                            id={`store-status-${store.id}`}
                          />
                          <Label htmlFor={`store-status-${store.id}`}>
                            {store.isActive
                              ? "Visible to customers"
                              : "Hidden from customers"}
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t p-6">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/stores/${store.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Manage
                      </Link>
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/store/${store.slug}`} target="_blank">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteStore(store.id)}
                        disabled={stores.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
