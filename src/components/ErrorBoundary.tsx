import { Component, type ReactNode } from "react";
import { Text } from "@chakra-ui/react";

type Props = { fallback?: ReactNode; children: ReactNode };
type State = { hasError: boolean };

/**
 * Garde-fou local : si un sous-arbre plante (donnée inattendue…), on
 * affiche un message discret au lieu de faire tomber toute l'app.
 */
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <Text fontSize="sm" color="fg.muted" mt="4">
            Impossible d'afficher cette section.
          </Text>
        )
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
