"use client";

import * as React from "react";
import { hexToRgba } from "@slat/utils";
import { useAudioStore } from "@/lib/stores/audio";
import type { Card } from "@/lib/types";

// lib/hooks/use-audio-visualizer.ts

type AudioVisualizerProps = Pick<Card, "shadowColor" | "shadowOpacity">;

export const useAudioVisualizer = ({
  shadowColor,
  shadowOpacity,
}: AudioVisualizerProps) => {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const srcRef = React.useRef<MediaElementAudioSourceNode | null>(null);
  const { isPlaying, muted } = useAudioStore();

  React.useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      audio.crossOrigin = "anonymous";

      // Create AudioContext and AnalyserNode only once
      if (!audioContextRef.current) {
        const context = new (window.AudioContext || window.AudioContext)(); // window.webkitAudioContext for Safari
        audioContextRef.current = context;

        const analyser = context.createAnalyser();
        analyserRef.current = analyser;

        // Create MediaElementSourceNode
        srcRef.current = context.createMediaElementSource(audio);
        srcRef.current.connect(analyser);
        analyser.connect(context.destination);

        analyser.fftSize = 2048;
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;
        analyser.smoothingTimeConstant = 0.75;
      }
    }
  }, [audioRef]);

  const renderFrame = () => {
    const analyser = analyserRef.current;
    const blurredDiv = document.querySelector(
      ".audio-visualizer-shadow"
    ) as HTMLElement | null;

    if (analyser && blurredDiv) {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      // Analyzing the first 20 bins for bass frequencies
      const bassFrequencies = dataArray.slice(0, 20);
      const averageBass =
        bassFrequencies.reduce((sum, value) => sum + value, 0) /
        bassFrequencies.length;

      // Calculate overall volume by averaging all frequency data
      const totalVolume =
        dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

      // Define a maximum shadow intensity
      const userDefinedIntensity = 400; // Maximum shadow intensity

      // Reduce the effect of total volume by scaling it down (e.g., 0.3 multiplier)
      const adjustedVolumeFactor = 0.6;
      const shadowIntensity =
        (averageBass / 255) *
        (totalVolume / 255) *
        userDefinedIntensity *
        adjustedVolumeFactor;

      // Create a dynamic spread based on shadow intensity
      const spread = shadowIntensity * 0.35; // Adjust spread multiplier as needed

      // Adjust the blur radius for a sharper shadow
      const blurRadius = Math.max(0, shadowIntensity * 1.5); // Adjust this factor for more or less blur

      // Update the shadow style of the visualizer div
      blurredDiv.style.boxShadow = `0px 0px ${blurRadius}px ${spread}px ${hexToRgba(
        shadowColor,
        shadowOpacity / 100
      )}`;

      // Request the next frame
      requestAnimationFrame(renderFrame);
    }
  };

  React.useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      audio.muted = muted;

      if (isPlaying) {
        // Resume audio context if suspended
        if (audioContextRef.current?.state === "suspended") {
          audioContextRef.current.resume();
        }
        audio.play().catch((e) => console.error("Error playing media:", e));
        renderFrame(); // Start the visualizer loop
      } else {
        audio.pause(); // Pause audio when not playing
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, muted]);

  return audioRef;
};
