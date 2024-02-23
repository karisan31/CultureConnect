import { Image, StyleSheet } from "react-native";
import React, { ComponentProps, useEffect, useMemo, useState } from "react";
import { supabase } from "../../config/initSupabase";

type RemoteImageProps = {
  path?: string | null;
  fallback: any;
} & Omit<ComponentProps<typeof Image>, "source">;

const RemoteImage = ({ path, fallback, ...imageProps }: RemoteImageProps) => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (!path) return;
    (async () => {
      setImage("");
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path!);

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

  if (!image || !path) {
    return <Image source={fallback} style={styles.profileImage} />;
  }

  return <Image source={{ uri: image || fallback }} {...imageProps} />;
};

export default RemoteImage;

const styles = StyleSheet.create({
  profileImage: {
    width: 225,
    height: 225,
    alignSelf: "center",
    borderRadius: 125,
    marginBottom: 20,
    top: -220,
  },
});
