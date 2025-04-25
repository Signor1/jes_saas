"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [currentColor, setCurrentColor] = useState(color)
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setCurrentColor(color)
  }, [color])

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentColor(e.target.value)
  }

  const handleApply = () => {
    onChange(currentColor)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setCurrentColor(color)
    setIsOpen(false)
  }

  const presetColors = [
    "#ef4444", // red
    "#f97316", // orange
    "#f59e0b", // amber
    "#10b981", // emerald
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#6366f1", // indigo
    "#8b5cf6", // violet
    "#d946ef", // fuchsia
    "#ec4899", // pink
  ]

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2">
          <div
            className="h-6 w-6 rounded-md border cursor-pointer"
            style={{ backgroundColor: color }}
            onClick={() => setIsOpen(true)}
          />
          <Input value={color} onChange={(e) => onChange(e.target.value)} className="h-8 w-[120px] font-mono text-xs" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-3">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">Color</label>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleApply}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="h-8 w-full rounded-md border mb-2" style={{ backgroundColor: currentColor }} />
            <Input
              ref={inputRef}
              type="color"
              value={currentColor}
              onChange={handleColorChange}
              className="h-10 w-full p-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Presets</label>
            <div className="grid grid-cols-5 gap-2">
              {presetColors.map((presetColor) => (
                <div
                  key={presetColor}
                  className="h-6 w-6 rounded-md border cursor-pointer"
                  style={{ backgroundColor: presetColor }}
                  onClick={() => {
                    setCurrentColor(presetColor)
                    onChange(presetColor)
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
