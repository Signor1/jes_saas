"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Edit,
  ExternalLink,
  Globe,
  Loader2,
  Plus,
  Trash2,
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
import { useAPI } from "@/contexts/jes-context";
import { useAccount } from "wagmi";

interface Store {
  id: string;
  store_name: string;
  slug?: string;
  description: string;
  image_cid: string;
  isActive?: boolean;
  createdAt?: string;
  owner_address: string;
}

export default function StoresPage() {
  const router = useRouter();
  const { address } = useAccount();
  const { getStores, createStore, updateStore, loading, error } = useAPI();
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStore, setNewStore] = useState({
    store_name: "",
    description: "",
    owner_address: address,
    image_cid: "",
  });

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await getStores();
        // Map API response to our store interface
        if (data && Array.isArray(data)) {
          const formattedStores = data.map(store => ({
            ...store,
            isActive: store.isActive !== undefined ? store.isActive : true,
            slug: store.id, 
            createdAt: store.createdAt || new Date().toISOString()
          }));

          const userStores = formattedStores.filter(store => store.owner_address === address);
          setStores(userStores);
        } else {
          setStores([]);
        }
      } catch (err) {
        console.error("Failed to fetch stores:", err);
        toast.error("Failed to load stores. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleCreateStore = async () => {
    setIsCreating(true);

    try {
      // Format the new store data for the API
      const storeData = {
        store_name: newStore.store_name,
        description: newStore.description || "Welcome to my store. Find great products at amazing prices!",
        image_cid:"https://res.cloudinary.com/dnohqlmjc/image/upload/v1742633486/event-1_kspr0f.png",
        owner_address: newStore.owner_address,
      };

      // Create the store using the API
      const response = await createStore(storeData);

      // If successful, add the new store to the state
      const newStoreData: Store = {
        id: response?.id || `store_${Math.random().toString(36).substring(2, 9)}`,
        store_name: storeData.store_name,
        slug: storeData.store_name.toLowerCase().replace(/\s+/g, "-"),
        description: storeData.description,
        image_cid: storeData.image_cid,
        isActive: true,
        createdAt: new Date().toISOString(),
        owner_address: storeData.owner_address as `0x${string}`,
      };

      setStores(prevStores => [...prevStores, newStoreData]);
      toast.success("Store created successfully!");

      // Reset the form and close the dialog
      setNewStore({
        store_name: "",
        description: "",
        owner_address: "" as `0x${string}`,
        image_cid: "",
      });
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to create store:", err);
      toast.error("There was an error creating your store. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const toggleStoreStatus = async (store: Store) => {
    try {
      const updatedStore = { ...store, isActive: !store.isActive };
      
      // Call the API to update the store
      await updateStore(store.id, {
        store_name: store.store_name,
        description: store.description,
        image_cid: store.image_cid,
        owner_address: store.owner_address,
        // Add any other fields that need to be sent for updates
      });

      // Update the local state
      setStores(stores.map(s => s.id === store.id ? updatedStore : s));
      
      toast.success(updatedStore.isActive ? "Store activated" : "Store deactivated");
    } catch (err) {
      console.error("Failed to update store status:", err);
      toast.error("Failed to update store status. Please try again.");
    }
  };

  const deleteStore = async (storeId: string) => {
    // In a real app, you would call an API to delete the store
    // Since we don't have that endpoint in our context yet, we'll just update the UI
    try {
      // Remove from local state
      setStores(stores.filter(store => store.id !== storeId));
      toast.success("Store deleted");
    } catch (err) {
      console.error("Failed to delete store:", err);
      toast.error("Failed to delete store. Please try again.");
    }
  };

  const copyStoreUrl = (slug: string) => {
    const url = `${window.location.origin}/store/${slug}`;
    navigator.clipboard.writeText(url);
    toast("URL copied!");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStore(prev => ({
          ...prev,
          image_cid: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Show error state if API error occurs
  if (error && !isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600">Error loading stores</h2>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-col">
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
                  <Label htmlFor="store_name">Store Name</Label>
                  <Input
                    id="store_name"
                    placeholder="My Awesome Store"
                    value={newStore.store_name}
                    onChange={(e) =>
                      setNewStore({ ...newStore, store_name: e.target.value })
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
                <div className="space-y-2">
                  <Label htmlFor="owner_address">Owner Address (Wallet)</Label>
                  <Input
                    id="owner_address"
                    placeholder="0x..."
                    value={address}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Store Logo</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {newStore.image_cid && (
                    <div className="mt-2 border rounded p-2 flex justify-center">
                      <img
                        src={newStore.image_cid}
                        alt="Store logo preview"
                        className="h-20 w-20 object-cover"
                      />
                    </div>
                  )}
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
                  disabled={!newStore.store_name || !newStore.owner_address || isCreating}
                >
                  {isCreating || loading ? (
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
          {isLoading || loading ? (
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
                          <img
                            src={`https://ipfs.io/ipfs/${store.image_cid}`}
                            alt={store.store_name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {store.store_name}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            Created{" "}
                            {new Date(store.createdAt || Date.now()).toLocaleDateString()}
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
                            {window.location.origin}/store/{store.slug || store.store_name?.toLowerCase().replace(/\s+/g, "-")}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => copyStoreUrl(store.slug || store.store_name?.toLowerCase().replace(/\s+/g, "-") || '')}
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
                            onCheckedChange={() => toggleStoreStatus(store)}
                            id={`store-status-${store.id}`}
                          />
                          <Label htmlFor={`store-status-${store.id}`}>
                            {store.isActive
                              ? "Visible to customers"
                              : "Hidden from customers"}
                          </Label>
                        </div>
                      </div>
                      {store.owner_address && (
                        <div>
                          <h3 className="text-sm font-medium">Owner Address</h3>
                          <div className="mt-1">
                            <code className="rounded bg-muted px-2 py-1 text-xs">
                              {`${store.owner_address.substring(0, 10)}...${store.owner_address.substring(store.owner_address.length - 6)}`}
                            </code>
                          </div>
                        </div>
                      )}
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
                        <Link href={`/store/${store.id}`} target="_blank">
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