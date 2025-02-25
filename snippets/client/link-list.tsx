"use client";

import * as React from "react";

import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableItem } from "@/components/core/sortable-item";
import { LinkItem } from "./link-item";
import { LinkCreate } from "./link-create";
import { LinksCustomizationForm } from "./links-customization-form";

import { BiolinkConfig, Link } from "@/lib/types";
import { useSortableList } from "@/lib/hooks/use-sortable-list";
import { Button } from "@/components/ui/button";
import { Icons } from "@slat/utils";

export function LinkList({
  items: _items,
  config: _config,
  premium,
  onboarding,
}: {
  items: Link[];
  config: BiolinkConfig;
  premium: boolean;
  onboarding?: boolean;
}) {
  const { items, setItems, activeId, sensors, handleDragStart, handleDragEnd } =
    useSortableList(_items, "/api/account/manage/links/reorder");

  const [config, setConfig] = React.useState(_config);
  const [open, setOpen] = React.useState(onboarding ?? false);

  const add = (link: Link) => {
    setItems([...items, link]);

    if (onboarding) setOpen(false);
  };

  const remove = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const save = (link: Link) => {
    const updatedItems = items.map((item) =>
      item.id === link.id ? link : item
    );
    setItems(updatedItems);
  };

  return (
    <>
      {!onboarding && (
        <div className="flex w-full justify-end gap-4">
          <LinksCustomizationForm
            items={items}
            config={config}
            premium={premium}
            onUpdate={(values) => {
              setConfig({
                ...config,
                icon: {
                  backgroundRadius: values.backgroundRadius,
                  detectSocialBackground:
                    values.style === "social-background"
                      ? true
                      : config.icon.detectSocialBackground,
                  detectSocialIcon:
                    values.style === "social-icon"
                      ? true
                      : config.icon.detectSocialIcon,
                  size: values.size,
                  glow: values.glow,
                },
              });

              const newItems = items.map((item) => ({
                ...item,
                colorPrimary: values.colorPrimary ?? item.colorPrimary,
                colorSecondary: values.colorSecondary ?? item.colorSecondary,
              }));

              setItems(newItems);
            }}
          />
          <Button onClick={() => setOpen(!open)}>
            {open ? (
              <Icons.close className="size-4" />
            ) : (
              <Icons.plusCircle className="size-4" />
            )}
            {open ? "Close" : "Add Link"}
          </Button>
        </div>
      )}
      {open && <LinkCreate config={config} onCreate={add} />}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="flex flex-wrap gap-4">
            {items
              .filter((item) => item.style === "icon")
              .map((item) => (
                <SortableItem key={item.id} id={item.id.toString()}>
                  <LinkItem
                    item={item}
                    onRemove={remove}
                    onSave={save}
                    config={config}
                  />
                </SortableItem>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items
              .filter((item) => item.style !== "icon")
              .map((item) => (
                <SortableItem key={item.id} id={item.id.toString()}>
                  <LinkItem
                    item={item}
                    onRemove={remove}
                    onSave={save}
                    config={config}
                  />
                </SortableItem>
              ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId
            ? (() => {
                const activeItem = items.find(
                  (item) => item.id.toString() === activeId
                );
                if (!activeItem) return null;

                return (
                  <SortableItem
                    key={activeItem.id}
                    id={activeItem.id.toString()}
                  >
                    <LinkItem
                      item={activeItem}
                      onRemove={remove}
                      onSave={save}
                      config={config}
                    />
                  </SortableItem>
                );
              })()
            : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
