const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000; // 1 second

export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries === 0) throw error;
    
    // Calculate delay with exponential backoff
    const delay = INITIAL_DELAY * Math.pow(2, MAX_RETRIES - retries);
    console.log(`Operation failed, retrying in ${delay}ms... (${retries} attempts remaining)`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(operation, retries - 1);
  }
} 