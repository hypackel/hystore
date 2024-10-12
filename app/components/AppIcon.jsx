import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";

const AppItemImage = ({ iconURL }) => {
  const placeholderImage = "https://placehold.co/400x400/000000/FFFFFF/png?text=No%5CnIcon&font=roboto";
  const [imageUri, setImageUri] = useState(iconURL || placeholderImage);

  useEffect(() => {
    // Reset to initial iconURL or placeholder whenever iconURL changes
    setImageUri(iconURL || placeholderImage);
  }, [iconURL]);

  return (
    <View style={styles.container}>
      <Image
        source={imageUri}
        style={styles.image}
        onError={() => setImageUri(placeholderImage)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 16,
  },
  image: {
    borderRadius: 8,
    width: 64,
    height: 64,
  },
});

export default AppItemImage;
