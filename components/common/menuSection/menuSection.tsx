import React, { useEffect, useRef, useState } from "react";
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
    <div className="flex  text-black">
      <aside className="w-1/5 h-full sticky top-0 py-4">
        <nav>
          <ul>
            {contentList.map((content) => (
              <li className="mb-1 text-left w-full" key={content.id}>
                <a
                  // href={`?section=${content.id}`}
                  className={`block p-2 text-black text-sm text-left rounded cursor-pointer border border-transparent  hover:text-primary relative ${
                    activeId === content.id ? "border-primary text-primary" : ""
                  }`}
                  onClick={() => handleNavLinkClick(content.id)}
                >
                  {activeId === content.id && (
                    <div className="absolute top-0 left-0 w-1 h-[100%] bg-primary "></div>
                  )}
                  <span className="">{content.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="w-4/5 py-4 px-12">
        {contentList.map((content, index) => (
          <>
            <section
              id={content.id}
              key={content.id}
              className="mb-4  rounded shadow "
              ref={(el) => {
                if (el) sectionRefs.current.push(el);
              }}
            >
              <content.Component />
            </section>
            {/* {index < contentList.length - 1 && (
              <div className="w-full mb-4 bg-primary rounded-md bg-opacity-45 h-1"></div>
            )} */}
          </>
        ))}
      </main>
    </div>
  );
};

export default MenuSection;
