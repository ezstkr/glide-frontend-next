import { UseToastOptions, useToast as useChakraToast } from '@chakra-ui/react';

interface ShowToastOptions {
  message: string;
  status?: UseToastOptions['status'];
  duration?: number;
  position?: UseToastOptions['position'];
}

const useToast = () => {
  const toast = useChakraToast();

  const showToast = ({ message, status = 'error', duration = 3000, position = 'top' }: ShowToastOptions) => {
    toast({
      title: message,
      status,
      duration,
      isClosable: true,
      position,
    });
  };

  return { showToast };
};

export default useToast;