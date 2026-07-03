"use client"

import React, { useState } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { cn } from "@/lib/utils"
import { Grid3X3, Layers, LayoutList, Star, ShoppingBag, Users, ShieldCheck, ChevronRight } from "lucide-react"

const layoutIcons = {
  stack: Layers,
  grid: Grid3X3,
  list: LayoutList,
}

const SWIPE_THRESHOLD = 50

// helper to generate a premium gradient mesh background based on card id or initials
function PremiumBannerFallback({ cardId, initials }) {
  const val = (cardId ? parseInt(cardId) : 0) || (initials ? initials.charCodeAt(0) : 0) || 0;
  const index = val % 5;
  const gradients = [
    "from-blue-600/40 via-indigo-600/30 to-purple-600/20",
    "from-purple-600/40 via-pink-600/30 to-rose-600/20",
    "from-emerald-500/40 via-teal-600/30 to-cyan-600/20",
    "from-orange-500/40 via-amber-500/30 to-yellow-500/20",
    "from-indigo-600/40 via-cyan-500/30 to-blue-500/20",
  ];
  const borderColors = [
    "border-blue-500/20",
    "border-pink-500/20",
    "border-emerald-500/20",
    "border-amber-500/20",
    "border-cyan-500/20",
  ];

  return (
    <div className={cn("absolute inset-0 bg-[#070a13] overflow-hidden border-b", borderColors[index])}>
      {/* Visual background pattern blobs */}
      <div className={cn("absolute -top-12 -left-12 w-32 h-32 rounded-full blur-2xl opacity-40", 
        index === 0 && "bg-blue-500",
        index === 1 && "bg-purple-500",
        index === 2 && "bg-emerald-500",
        index === 3 && "bg-orange-500",
        index === 4 && "bg-indigo-500"
      )} />
      <div className={cn("absolute -bottom-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-30", 
        index === 0 && "bg-purple-500",
        index === 1 && "bg-pink-500",
        index === 2 && "bg-teal-500",
        index === 3 && "bg-yellow-500",
        index === 4 && "bg-cyan-500"
      )} />
      {/* Diagonal grid overlay line */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
    </div>
  )
}

function GridCard({ card }) {
  const [imgError, setImgError] = useState(false)
  const imageUrl = card.bannerUrl

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Banner Area */}
      <div className="relative h-32 w-full overflow-hidden bg-[#070a13] shrink-0">
        {imageUrl && !imgError ? (
          <>
            <img 
              src={imageUrl} 
              onError={() => setImgError(true)}
              className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-500 group-hover:scale-105" 
              alt="Store Banner" 
            />
            {/* Overlay to bridge banner and body */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card,#0d1527)] via-black/10 to-transparent" />
          </>
        ) : (
          <PremiumBannerFallback cardId={card.id} initials={card.initials} />
        )}
        
        {/* Rating Floating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/45 backdrop-blur-md border border-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-black text-amber-400 shadow-md">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-white font-bold">{Number(card.rating).toFixed(1)}</span>
        </div>
      </div>

      {/* Body Area */}
      <div className="px-5 pb-5 flex-1 flex flex-col justify-between relative">
        {/* Avatar logo overlapping the banner */}
        <div className="flex gap-3 text-left relative -mt-6">
          {card.logoUrl ? (
            <img
              src={card.logoUrl}
              alt={card.title}
              className="w-12 h-12 rounded-2xl object-cover shadow-lg border-2 border-[var(--bg-card,#0d1527)] shrink-0 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-lg border-2 border-[var(--bg-card,#0d1527)] shrink-0 transition-transform duration-300 group-hover:scale-105",
              card.avatarBg ? card.avatarBg : 'bg-gradient-to-tr from-blue-600 to-indigo-500'
            )}>
              {card.initials}
            </div>
          )}

          <div className="min-w-0 flex-1 pt-6">
            <div className="flex items-center justify-between group/title">
              <div className="flex items-center gap-1.5 min-w-0">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base truncate transition-colors group-hover/title:text-blue-500">
                  {card.title}
                </h3>
                <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 group-hover/title:text-blue-500 transition-all transform translate-x-0 group-hover/title:translate-x-1" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed font-medium">
              {card.description}
            </p>
          </div>
        </div>

        {/* Footer Metrics Row */}
        <div className="flex items-center gap-2 pt-4 mt-5 border-t border-slate-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-1.5 bg-blue-500/5 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{card.productsCount} Items</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>{card.followersCount.toLocaleString()} Followers</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function StackCard({ card, isTopCard, showContent }) {
  const [imgError, setImgError] = useState(false)
  const imageUrl = card.bannerUrl

  return (
    <div className={cn(
      "w-full h-full flex flex-col justify-between transition-opacity duration-200",
      showContent ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      {/* Banner */}
      <div className="relative h-24 w-full overflow-hidden bg-[#070a13] shrink-0">
        {imageUrl && !imgError ? (
          <>
            <img 
              src={imageUrl} 
              onError={() => setImgError(true)}
              className="w-full h-full object-cover select-none pointer-events-none" 
              alt="Store Banner" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card,#0d1527)] via-black/10 to-transparent" />
          </>
        ) : (
          <PremiumBannerFallback cardId={card.id} initials={card.initials} />
        )}
        
        {/* Rating Floating Badge */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/45 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-full text-[10px] font-black text-amber-400 shadow-md">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-white font-bold">{Number(card.rating).toFixed(1)}</span>
        </div>
      </div>

      {/* Body Area */}
      <div className="px-4 pb-4 flex-1 flex flex-col justify-between relative">
        {/* Avatar logo overlapping the banner */}
        <div className="flex gap-2.5 text-left relative -mt-5">
          {card.logoUrl ? (
            <img
              src={card.logoUrl}
              alt={card.title}
              className="w-10 h-10 rounded-xl object-cover shadow-lg border-2 border-[var(--bg-card,#0d1527)] shrink-0"
            />
          ) : (
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-lg border-2 border-[var(--bg-card,#0d1527)] shrink-0",
              card.avatarBg ? card.avatarBg : 'bg-gradient-to-tr from-blue-600 to-indigo-500'
            )}>
              {card.initials}
            </div>
          )}

          <div className="min-w-0 flex-1 pt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm truncate">
                  {card.title}
                </h3>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed font-medium">
              {card.description}
            </p>
          </div>
        </div>

        {/* Footer Metrics Row */}
        <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-1 bg-blue-500/5 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider">
            <ShoppingBag className="w-3 h-3" />
            <span>{card.productsCount} Items</span>
          </div>
          <div className="flex items-center gap-1 bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider">
            <Users className="w-3 h-3" />
            <span>{card.followersCount.toLocaleString()} Followers</span>
          </div>
        </div>
      </div>

      {isTopCard && (
        <div className="absolute bottom-2 left-0 right-0 text-center select-none pointer-events-none">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500/70 animate-pulse">Swipe or Drag to flip</span>
        </div>
      )}
    </div>
  )
}

function ListCard({ card }) {
  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* Initials Avatar / Logo */}
        {card.logoUrl ? (
          <img
            src={card.logoUrl}
            alt={card.title}
            className="w-12 h-12 rounded-2xl object-cover shadow-md border border-white/10 shrink-0"
          />
        ) : (
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-md border border-white/10 shrink-0",
            card.avatarBg ? card.avatarBg : 'bg-gradient-to-tr from-blue-600 to-indigo-500'
          )}>
            {card.initials}
          </div>
        )}
        
        {/* Title & Tagline */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg truncate">
              {card.title}
            </h3>
            <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
            {card.description}
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="flex items-center gap-3 shrink-0 flex-wrap">
        <div className="flex items-center gap-1.5 bg-blue-500/5 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{card.productsCount} Items</span>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider">
          <Users className="w-3.5 h-3.5" />
          <span>{card.followersCount.toLocaleString()} Followers</span>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-500/5 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{Number(card.rating).toFixed(1)}</span>
        </div>
      </div>

      {/* Action link strip */}
      <div className="flex justify-end sm:pl-2 shrink-0">
        <span className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:underline">
          View Store
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </div>
  )
}

export function MorphingCardStack({
  cards = [],
  className,
  defaultLayout = "stack",
  onCardClick,
}) {
  const [layout, setLayout] = useState(defaultLayout)
  const [expandedCard, setExpandedCard] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  if (!cards || cards.length === 0) {
    return null
  }

  const handleDragEnd = (event, info) => {
    const { offset, velocity } = info
    const swipe = Math.abs(offset.x) * velocity.x

    if (offset.x < -SWIPE_THRESHOLD || swipe < -1000) {
      setActiveIndex((prev) => (prev + 1) % cards.length)
    } else if (offset.x > SWIPE_THRESHOLD || swipe > 1000) {
      setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length)
    }
    setIsDragging(false)
  }

  const getStackOrder = () => {
    const reordered = []
    for (let i = 0; i < cards.length; i++) {
      const index = (activeIndex + i) % cards.length
      reordered.push({ ...cards[index], stackPosition: i })
    }
    return reordered.reverse()
  }

  const getLayoutStyles = (stackPosition) => {
    switch (layout) {
      case "stack":
        return {
          top: stackPosition * 8,
          left: stackPosition * 8,
          zIndex: cards.length - stackPosition,
          rotate: (stackPosition - 1) * 2,
        }
      case "grid":
      case "list":
        return {
          top: 0,
          left: 0,
          zIndex: 1,
          rotate: 0,
        }
    }
  }

  const containerStyles = {
    stack: "relative h-[300px] sm:h-[320px] w-full max-w-[340px]",
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full",
    list: "flex flex-col gap-4 w-full",
  }

  const displayCards = layout === "stack" ? getStackOrder() : cards.map((c, i) => ({ ...c, stackPosition: i }))

  return (
    <div className={cn("space-y-6", className)}>
      {/* Layout Selector Button Bar */}
      <div className="flex items-center justify-center gap-1 rounded-xl bg-[#0d1527] border border-white/[0.08] p-1.5 w-fit mx-auto shadow-md">
        {Object.keys(layoutIcons).map((mode) => {
          const Icon = layoutIcons[mode]
          return (
            <button
              key={mode}
              onClick={() => setLayout(mode)}
              className={cn(
                "rounded-lg p-2.5 transition-all duration-200",
                layout === mode
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/15 scale-105"
                  : "text-slate-400 hover:text-white hover:bg-white/5",
              )}
              aria-label={`Switch to ${mode} layout`}
            >
              <Icon className="h-4.5 w-4.5" />
            </button>
          )
        })}
      </div>

      {/* Cards Display Panel */}
      <LayoutGroup>
        <motion.div layout className={cn(containerStyles[layout], "mx-auto")}>
          <AnimatePresence mode="popLayout">
            {displayCards.map((card) => {
              const styles = getLayoutStyles(card.stackPosition)
              const isExpanded = expandedCard === card.id
              const isTopCard = layout === "stack" && card.stackPosition === 0
              const showContent = layout !== "stack" || isTopCard

              const isStack = layout === "stack"
              const isList = layout === "list"
              const isGrid = layout === "grid"

              return (
                <motion.div
                  key={card.id}
                  layoutId={card.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: isExpanded ? 1.05 : 1,
                    x: 0,
                    ...styles,
                  }}
                  exit={{ opacity: 0, scale: 0.8, x: -200 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                  drag={isTopCard ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ scale: 1.02, cursor: "grabbing" }}
                  onClick={() => {
                    if (isDragging) return
                    setExpandedCard(isExpanded ? null : card.id)
                    onCardClick?.(card)
                  }}
                  className={cn(
                    "group cursor-pointer rounded-3xl border text-left flex flex-col justify-between overflow-hidden shadow-lg",
                    "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5",
                    "bg-[#0d1527] border-white/10 hover:border-white/20",
                    isStack 
                      ? "absolute w-[calc(100%-16px)] sm:w-[320px] h-[260px] sm:h-[280px]" 
                      : "w-full",
                    isStack && isTopCard && "cursor-grab active:cursor-grabbing",
                    isGrid && "min-h-[290px]",
                    isList && "w-full",
                    isExpanded && "ring-2 ring-blue-500",
                  )}
                  style={{
                    backgroundColor: card.color || undefined,
                  }}
                >
                  {isStack && (
                    <StackCard 
                      card={card} 
                      isTopCard={isTopCard} 
                      showContent={showContent} 
                    />
                  )}
                  {isGrid && <GridCard card={card} />}
                  {isList && <ListCard card={card} />}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {/* Slide dots for Stack view */}
      {layout === "stack" && cards.length > 1 && (
        <div className="flex justify-center gap-2 pt-2">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === activeIndex ? "w-5 bg-blue-500" : "w-1.5 bg-slate-500/30 hover:bg-slate-500/65",
              )}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
