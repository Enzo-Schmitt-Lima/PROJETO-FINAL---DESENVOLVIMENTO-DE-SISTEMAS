import React, { useEffect, useState, useContext } from "react";
import { Image, ImageProps, ActivityIndicator, View, StyleSheet } from "react-native";
import { AuthContext } from "../contexts/AuthContext";

interface AuthImageProps extends Omit<ImageProps, 'source'> {
  uri: string;
  style?: any;
}

const AuthImage: React.FC<AuthImageProps> = ({ uri, style, ...rest }) => {
  const { user, isGuest } = useContext(AuthContext);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      try {
        if(isGuest || !user) {
          // If guest or no user, just fallback to normal uri usage
          if(isMounted) {
            setBase64Image(null);
            setLoading(false);
          }
          return;
        }
        const token = user.token || "";
        const response = await fetch(uri, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          if(isMounted) {
            setBase64Image(reader.result ? reader.result.toString() : null);
            setLoading(false);
          }
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.log("AuthImage fetch error: ", error);
        if(isMounted) {
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [uri, user, isGuest]);

  if (loading) {
    return (
      <View style={[styles.loader, style]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (base64Image) {
    return <Image source={{ uri: base64Image }} style={style} {...rest} />;
  }

  // Fallback to direct URI if base64 not ready or error
  return <Image source={{ uri }} style={style} {...rest} />;
};

const styles = StyleSheet.create({
  loader: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AuthImage;
