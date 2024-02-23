import { Image } from "react-native";
import React, { ComponentProps, useEffect, useMemo, useState } from "react";
import { supabase } from "../../config/initSupabase";

type RemoteImageProps = {
  path?: string | null;
  fallback: string;
  bucket: string;
} & Omit<ComponentProps<typeof Image>, "source">;

const RemoteImage = ({
  path,
  fallback,
  bucket,
  ...imageProps
}: RemoteImageProps) => {
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!path) return;
    (async () => {
      setImage("");
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path);

      if (error) {
        console.log(error, "<---error");
      }

      if (data) {
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          setImage(fr.result as string);
        };
      }
    })();
  }, [path]);

  if (!image) {
  }
  return <Image source={{ uri: image || fallback }} {...imageProps} />;
};

export default RemoteImage;
