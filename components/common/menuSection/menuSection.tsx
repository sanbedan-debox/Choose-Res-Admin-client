import React, { useState, useEffect, useRef } from "react";
import { SectionContent } from "./interface";

type MenuSectionProps = {
  contentList: SectionContent[];
};

const MenuSection: React.FC<MenuSectionProps> = ({ contentList }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sectionRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const handleScroll = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
          window.history.replaceState(null, "", `#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(handleScroll, {
      root: null,
      rootMargin: "0px",
      threshold: 0.6,
    });

    sectionRefs.current.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleNavLinkClick = (id: string) => {
    const targetSection = document.getElementById(id);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex text-gray-100">
      <aside className="w-1/4 h-screen sticky top-0 p-4">
        <nav>
          <ul>
            {contentList.map((content) => (
              <li className="mb-1" key={content.id}>
                <a
                  href={`#${content.id}`}
                  className={`block p-2 hover:bg-gray-700 text-sm rounded ${
                    activeId === content.id ? "bg-gray-700 font-bold" : ""
                  }`}
                  onClick={() => handleNavLinkClick(content.id)}
                >
                  {content.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="w-3/4 p-4">
        {contentList.map((content) => (
          <section
            id={content.id}
            key={content.id}
            className="mb-16 p-4 rounded shadow"
            ref={(el) => {
              if (el) sectionRefs.current.push(el);
            }}
            style={{
              background: "rgb(4,7,29)",
              backgroundColor:
                "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
            }}
          >
            <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
            <content.Component />
          </section>
        ))}
      </main>
    </div>
  );
};

export default MenuSection;
