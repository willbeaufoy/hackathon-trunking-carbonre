import { useSigninCheck } from "reactfire";

export const AuthWrapper = ({ children, fallback }: React.PropsWithChildren<{ fallback: JSX.Element }>): JSX.Element => {
    const { data: signInCheckResult, status } = useSigninCheck();
  
    if (!children) {
      throw new Error('Children must be provided');
    }
    
    if (signInCheckResult?.signedIn === true) {
      return children as JSX.Element;
    } 
  
    if (status === 'loading') {
      return <>Loading</>
    }
    
    return fallback;
  };