import { ImageResponse } from "next/og";
import { OpengraphImage } from "@/components/core/opengraph-image";
import { fetchOpenGraphData } from "@/lib/application/metadata/actions";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

// app/api/[username]/og/route.ts

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      username: string;
    }>;
  }
) {
  const { username } = await params;
  try {
    const data = await fetchOpenGraphData(username, false);

    if (!data) {
      return new Response(`Not found`, {
        status: 404,
      });
    }

    return new ImageResponse(<OpengraphImage data={data} />, {
      width: 1200,
      height: 630,
    });
  } catch (e) {
    console.log(e);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
