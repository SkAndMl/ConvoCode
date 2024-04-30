import requests
from bs4 import BeautifulSoup
import time
import os

library_url = {
    "numpy": "https://numpy.org/doc/stable/reference/index.html#reference"
}


def scrape_page(library_name: str) -> None:
    if not os.path.exists(f"_data/{library_name}"):
        os.mkdir(f"_data/{library_name}")
    
    visited_urls = set()
    base_url = library_url[library_name]

    def _scrape_page(url):
        if url in visited_urls:
            return
        visited_urls.add(url)

        if len(visited_urls)>300:
            return

        response = requests.get(url)
        soup = BeautifulSoup(response.content, "html.parser")
        text = soup.text
        non_empty_lines = sum(1 for line in text.split("\n") if line.strip())

        if non_empty_lines>50:
            with open(f"_data/{library_name}/{url.replace('/', '_')}.txt", "w") as f:
                f.write(str(soup.text))
        links = soup.find_all("a")
        for link in links:
            href = link.get("href")
            if href and not href.startswith("http"):
                full_url = base_url + href
                _scrape_page(full_url)

        time.sleep(0.5)

    _scrape_page(base_url)

if __name__ == "__main__":
    library_name = "numpy"
    scrape_page(library_name)
