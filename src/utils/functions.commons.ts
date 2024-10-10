export async function formatEmail(email: string): Promise<string> {
    return email
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }