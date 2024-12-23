import requests
import time
import random

# Membaca URL dari file url.txt
def load_urls(file_path):
    try:
        with open(file_path, "r") as file:
            return [line.strip() for line in file.readlines() if line.strip()]
    except FileNotFoundError:
        print(f"File {file_path} tidak ditemukan.")
        return []

# Membaca Referer dari file referers.txt
def load_referers(file_path):
    try:
        with open(file_path, "r") as file:
            return [line.strip() for line in file.readlines() if line.strip()]
    except FileNotFoundError:
        print(f"File {file_path} tidak ditemukan.")
        return []

# Membaca User-Agent dari file user-agent.txt
def load_user_agents(file_path):
    try:
        with open(file_path, 'r') as file:
            return [line.strip() for line in file.readlines() if line.strip()]
    except FileNotFoundError:
        print(f"File {file_path} tidak ditemukan.")
        return []

# Fungsi untuk melakukan permintaan HTTP
def fetch_url(url, headers, referers):
    try:
        random_referer = random.choice(referers)
        headers["Referer"] = random_referer
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # Memastikan status code 200

        print(f"Request ke {url} berhasil dengan Referer: {random_referer}")
        print(f"Status Code: {response.status_code}")
        return response.status_code

    except requests.exceptions.RequestException as e:
        print(f"Error saat mengakses {url}: {e}")
        return None

# Fungsi utama
if __name__ == "__main__":
    # Memuat data dari file
    urls = load_urls("url.txt")
    referers = load_referers("referers.txt")
    user_agents = load_user_agents("user-agent.txt")

    if not urls:
        print("Daftar URL kosong. Pastikan file url.txt tidak kosong.")
        exit()

    if not referers:
        print("Daftar Referer kosong. Pastikan file referers.txt tidak kosong.")
        exit()

    if not user_agents:
        print("Daftar User-Agent kosong. Pastikan file user-agent.txt tidak kosong.")
        exit()

    # Menjalankan loop untuk setiap URL
    iteration = 1
    max_iterations = 1000  # Batas jumlah iterasi

    while iteration <= max_iterations:
        print(f"Iterasi ke-{iteration}")
        
        # Pilih User-Agent secara acak untuk setiap iterasi
        chosen_user_agent = random.choice(user_agents)
        headers_template = {"User-Agent": chosen_user_agent}
        print(f"User-Agent yang digunakan: {headers_template['User-Agent']}")

        for url in urls:
            fetch_url(url, headers_template, referers)
            delay = random.uniform(5, 15)  # Waktu tunggu acak antara 5-15 detik
            print(f"Menunggu {delay:.2f} detik sebelum permintaan berikutnya...")
            time.sleep(delay)

        iteration += 1

    print("Selesai. Semua iterasi telah dijalankan.")
