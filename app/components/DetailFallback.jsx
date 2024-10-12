import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Image } from "expo-image";

const FallbackImage = ({ iconURL, style }) => {
  const placeholderImage = "https://placehold.co/400x400/000000/FFFFFF/png?text=No%5CnIcon&font=roboto";
  const [imageUri, setImageUri] = useState(iconURL || placeholderImage);

  useEffect(() => {
    // Reset to the initial iconURL or placeholder whenever iconURL changes
    setImageUri(iconURL || placeholderImage);
  }, [iconURL]);

  return (
    <View style={style}>
      <Image
        source={imageUri}
        style={style}
        onError={() => setImageUri(placeholderImage)}
      />
    </View>
  );
};

export default FallbackImage;
