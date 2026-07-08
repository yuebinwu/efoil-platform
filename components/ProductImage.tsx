'use client';
import { useState } from 'react';

export default function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className="w-full h-full object-cover"
      // 关键点：只在加载失败时设置一次，且使用一个确定的兜底路径
      onError={() => {
        setImgSrc('/placeholder.jpg'); 
      }}
    />
  );
}