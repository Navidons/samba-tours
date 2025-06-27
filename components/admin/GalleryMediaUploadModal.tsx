"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase"
import { X, UploadCloud } from "lucide-react"

export default function GalleryMediaUploadModal({ galleries, onUploadComplete }) {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [mediaType, setMediaType] = useState<"image" | "video">("image")
  const [selectedGalleryId, setSelectedGalleryId] = useState("")
  const [titles, setTitles] = useState<string[]>([])
  const [descriptions, setDescriptions] = useState<string[]>([])
  const [alts, setAlts] = useState<string[]>([])
  const [photographers, setPhotographers] = useState<string[]>([])
  const [dates, setDates] = useState<string[]>([])
  const [featured, setFeatured] = useState<boolean[]>([])
  const [thumbnails, setThumbnails] = useState<string[]>([])
  const [durations, setDurations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadedMedia, setUploadedMedia] = useState<any[]>([])
  const [uploadProgress, setUploadProgress] = useState<number[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    setTitles(files.map(() => ""))
    setDescriptions(files.map(() => ""))
    setAlts(files.map(() => ""))
    setPhotographers(files.map(() => ""))
    setDates(files.map(() => ""))
    setFeatured(files.map(() => false))
    setThumbnails(files.map(() => ""))
    setDurations(files.map(() => ""))
  }, [files, mediaType])

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleUpload = async () => {
    if (!files.length || !selectedGalleryId) return
    setLoading(true)
    setUploadProgress(Array(files.length).fill(0))
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to upload media.");
      setLoading(false);
      return;
    }
    const table = mediaType === "image" ? "gallery_images" : "gallery_videos"
    const uploaded = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const galleryIdNum = Number(selectedGalleryId);
      if (!galleryIdNum || isNaN(galleryIdNum)) {
        alert("Invalid gallery selected. Please select a gallery.");
        setLoading(false);
        return;
      }
      const storagePath = `${mediaType}s/${Date.now()}-${file.name}`
      setUploadProgress((prev) => prev.map((p, idx) => idx === i ? 30 : p))
      const { error: uploadError } = await supabase.storage.from("gallery").upload(storagePath, file, { upsert: true })
      if (uploadError) {
        alert("Upload failed: " + uploadError.message)
        continue
      }
      setUploadProgress((prev) => prev.map((p, idx) => idx === i ? 70 : p))
      const publicUrl = supabase.storage.from("gallery").getPublicUrl(storagePath).data.publicUrl
      let insertPayload: any
      if (mediaType === "image") {
        insertPayload = {
          gallery_id: galleryIdNum,
          src: publicUrl,
          alt: alts[i] || titles[i] || file.name,
          title: titles[i],
          description: descriptions[i],
          photographer: photographers[i],
          date: dates[i] || null,
          featured: featured[i],
          size: file.size,
        }
      } else {
        insertPayload = {
          gallery_id: galleryIdNum,
          src: publicUrl,
          thumbnail: thumbnails[i],
          title: titles[i],
          description: descriptions[i],
          duration: durations[i] ? Number(durations[i]) : null,
          featured: featured[i],
          size: file.size,
        }
      }
      // Debug logs
      console.log("Current user:", user)
      console.log("Insert payload for file", file.name, ":", insertPayload)
      const { data, error: insertError } = await supabase.from(table).insert(insertPayload).select().single()
      if (insertError) {
        console.error("Insert error for file", file.name, ":", insertError)
        alert("DB insert failed: " + insertError.message)
        continue
      }
      setUploadProgress((prev) => prev.map((p, idx) => idx === i ? 100 : p))
      uploaded.push(data)
    }
    setLoading(false)
    setOpen(false)
    setFiles([])
    setTitles([])
    setDescriptions([])
    setAlts([])
    setPhotographers([])
    setDates([])
    setFeatured([])
    setThumbnails([])
    setDurations([])
    setUploadProgress([])
    setUploadedMedia(uploaded)
    onUploadComplete?.()
  }

  // Edit handler
  const handleEdit = async (index: number, newTitle: string, newDescription: string) => {
    const supabase = createClient()
    const media = uploadedMedia[index]
    const table = mediaType === "image" ? "gallery_images" : "gallery_videos"
    const { error } = await supabase.from(table).update({ title: newTitle, description: newDescription }).eq("id", media.id)
    if (!error) {
      const updated = [...uploadedMedia]
      updated[index] = { ...media, title: newTitle, description: newDescription }
      setUploadedMedia(updated)
      onUploadComplete?.()
    } else {
      alert("Edit failed: " + error.message)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Upload Media</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl w-full max-h-[80vh] overflow-y-auto mx-auto animate-fade-in">
          <DialogTitle>Upload Images or Videos</DialogTitle>
          <Select value={mediaType} onValueChange={setMediaType}>
            <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedGalleryId} onValueChange={setSelectedGalleryId}>
            <SelectTrigger><SelectValue placeholder="Select Gallery" /></SelectTrigger>
            <SelectContent>
              {galleries.map(gallery => (
                <SelectItem key={gallery.id} value={gallery.id}>{gallery.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Drag-and-drop area */}
          <div
            className={`w-full my-4 rounded-xl border-2 border-dashed transition-colors flex flex-col items-center justify-center cursor-pointer p-6 ${dragActive ? 'border-forest-500 bg-forest-50' : 'border-gray-300 bg-gray-50 hover:border-forest-400'}`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <UploadCloud className={`h-10 w-10 mb-2 ${dragActive ? 'text-forest-600' : 'text-gray-400'}`} />
            <div className="font-medium text-earth-700 mb-1">Drag & drop files here or click to select</div>
            <div className="text-xs text-earth-500">(You can select multiple {mediaType === 'image' ? 'images' : 'videos'})</div>
            <Input
              ref={fileInputRef}
              type="file"
              accept={mediaType === "image" ? "image/*" : "video/*"}
              multiple
              className="hidden"
              onChange={e => setFiles(Array.from(e.target.files || []))}
            />
          </div>
          {/* Modern preview grid for selected files */}
          {files.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <div className="flex flex-row gap-6 min-w-[600px]" style={{ minWidth: 600 }}>
                {files.map((file, i) => {
                  const url = URL.createObjectURL(file)
                  return (
                    <div key={i} className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col items-center group border border-gray-200 min-w-[260px] max-w-xs w-[260px] animate-fade-in min-h-60 mr-2 last:mr-0">
                      <button
                        className="absolute top-2 right-2 bg-gray-100 hover:bg-red-200 rounded-full p-1 z-10 transition-colors"
                        title="Remove"
                        onClick={() => {
                          const newFiles = files.filter((_, idx) => idx !== i)
                          setFiles(newFiles)
                          setTitles(titles.filter((_, idx) => idx !== i))
                          setDescriptions(descriptions.filter((_, idx) => idx !== i))
                          setAlts(alts.filter((_, idx) => idx !== i))
                          setPhotographers(photographers.filter((_, idx) => idx !== i))
                          setDates(dates.filter((_, idx) => idx !== i))
                          setFeatured(featured.filter((_, idx) => idx !== i))
                          setThumbnails(thumbnails.filter((_, idx) => idx !== i))
                          setDurations(durations.filter((_, idx) => idx !== i))
                        }}
                      >
                        <X className="h-4 w-4 text-gray-500 group-hover:text-red-600 transition-colors" />
                      </button>
                      <div className="w-full h-60 flex items-center justify-center mb-3 rounded-lg overflow-hidden bg-gray-50">
                        {mediaType === "image" ? (
                          <img src={url} alt={file.name} className="object-contain w-full h-full transition-transform group-hover:scale-105 animate-fade-in" />
                        ) : (
                          <video src={url} controls className="object-contain w-full h-full animate-fade-in" />
                        )}
                      </div>
                      <div className="w-full text-center mb-2">
                        <div className="font-medium text-earth-900 truncate" title={file.name}>{file.name}</div>
                        <div className="text-xs text-earth-500">{(file.size / 1024).toFixed(1)} KB</div>
                      </div>
                      <Input
                        className="mb-2 focus:ring-2 focus:ring-forest-500"
                        placeholder="Title"
                        value={titles[i] || ""}
                        onChange={e => {
                          const t = [...titles]; t[i] = e.target.value; setTitles(t)
                        }}
                      />
                      <Input
                        className="mb-2 focus:ring-2 focus:ring-forest-500"
                        placeholder="Description"
                        value={descriptions[i] || ""}
                        onChange={e => {
                          const d = [...descriptions]; d[i] = e.target.value; setDescriptions(d)
                        }}
                      />
                      {mediaType === "image" && (
                        <>
                          <Input
                            className="mb-2 focus:ring-2 focus:ring-forest-500"
                            placeholder="Alt text"
                            value={alts[i] || ""}
                            onChange={e => {
                              const a = [...alts]; a[i] = e.target.value; setAlts(a)
                            }}
                          />
                          <Input
                            className="mb-2 focus:ring-2 focus:ring-forest-500"
                            placeholder="Photographer"
                            value={photographers[i] || ""}
                            onChange={e => {
                              const p = [...photographers]; p[i] = e.target.value; setPhotographers(p)
                            }}
                          />
                          <Input
                            className="mb-2 focus:ring-2 focus:ring-forest-500"
                            placeholder="Date (YYYY-MM-DD)"
                            value={dates[i] || ""}
                            onChange={e => {
                              const d = [...dates]; d[i] = e.target.value; setDates(d)
                            }}
                          />
                        </>
                      )}
                      {mediaType === "video" && (
                        <>
                          <Input
                            className="mb-2 focus:ring-2 focus:ring-forest-500"
                            placeholder="Thumbnail URL (optional)"
                            value={thumbnails[i] || ""}
                            onChange={e => {
                              const t = [...thumbnails]; t[i] = e.target.value; setThumbnails(t)
                            }}
                          />
                          <Input
                            className="mb-2 focus:ring-2 focus:ring-forest-500"
                            placeholder="Duration (seconds)"
                            value={durations[i] || ""}
                            onChange={e => {
                              const d = [...durations]; d[i] = e.target.value; setDurations(d)
                            }}
                          />
                        </>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={featured[i] || false}
                            onChange={e => {
                              const f = [...featured]; f[i] = e.target.checked; setFeatured(f)
                            }}
                          />
                          <span className="text-xs text-earth-600">Featured</span>
                        </label>
                      </div>
                      {/* Progress bar */}
                      {loading && (
                        <div className="w-full h-2 bg-gray-200 rounded mt-2 overflow-hidden">
                          <div className="h-2 bg-forest-500 transition-all" style={{ width: `${uploadProgress[i] || 0}%` }} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          <Button onClick={handleUpload} disabled={loading || !files.length || !selectedGalleryId} className="mt-6 w-full">
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </DialogContent>
      </Dialog>
      {/* Uploaded media list with edit options */}
      {uploadedMedia.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Recently Uploaded</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedMedia.map((media, i) => (
              <div key={media.id} className="border rounded-lg p-2 bg-white shadow-sm hover:shadow-md transition-shadow">
                {mediaType === "image" ? (
                  <img src={media.src} alt={media.title} className="w-full h-40 object-cover mb-2 rounded" />
                ) : (
                  <video src={media.src} controls className="w-full h-40 object-cover mb-2 rounded" />
                )}
                <Input value={media.title || ""} onChange={e => handleEdit(i, e.target.value, media.description)} className="mb-2 focus:ring-2 focus:ring-forest-500" />
                <Input value={media.description || ""} onChange={e => handleEdit(i, media.title, e.target.value)} className="focus:ring-2 focus:ring-forest-500" />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Fade-in animation */}
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </>
  )
} 