"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase"

export default function GalleryCreateModal({ onGalleryCreated }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCreate = async () => {
    if (!name) {
      setError("Name is required")
      return
    }
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { error: insertError } = await supabase.from("galleries").insert({
      name,
      category,
      description,
    })
    setLoading(false)
    if (insertError) {
      setError(insertError.message)
      return
    }
    setOpen(false)
    setName("")
    setCategory("")
    setDescription("")
    onGalleryCreated?.()
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <span className="flex items-center">
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
          New Gallery
        </span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Create New Gallery</DialogTitle>
          <Input placeholder="Gallery Name" value={name} onChange={e => setName(e.target.value)} />
          <Input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
          <Input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <Button onClick={handleCreate} disabled={loading || !name}>
            {loading ? "Creating..." : "Create Gallery"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
} 