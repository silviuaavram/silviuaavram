import React from 'react'
import Layout from '@theme/Layout'
import styles from './about.module.css'
import Link from '@docusaurus/Link'

export default function About() {
  return (
    <Layout title="About Silviu" description="A few words about the author">
      <div className={styles.mainContainer}>
        <h1>New Blog. Who dis?</h1>
        <header>
          <article className={styles.articleInContent}>
            <section className={styles.sectionContainer}>
              <img
                className={`${styles.sectionImage} ${styles.sectionPortraitImage}`}
                alt="silviu sitting in front of to the fountain in piazza de ferrari in genoa"
                src="/img/pictures/about-author-1800w.jpg"
                srcSet="/img/pictures/about-author-400w.jpg 400w, /img/pictures/about-author-600w.jpg 600w, /img/pictures/about-author-800w.jpg 800w, /img/pictures/about-author-1000w.jpg 1000w, /img/pictures/about-author-1200w.jpg 1200w, /img/pictures/about-author-1500w.jpg 1500w, /img/pictures/about-author-1800w.jpg 1800w"
                sizes="(max-width: 639px) 100vw, (min-width: 640px) and (max-width: 1019px) 608px, (min-width: 1020px) and (max-width: 1279px) 40vw, (min-width: 1280px) 542px"
              />
              <section
                className={`${styles.sectionContent} ${styles.sectionLargerContent}`}
              >
                <p>Hi, I'm Silviu. That's me in the picture ⛲️.</p>
                <p>
                  I'm a software engineer 👨‍💻. When I'm not coding, I spend my
                  time playing basketball 🏀, salsa dancing 🕺 and drinking
                  cofee ☕️. I also drink coffee when coding, so there's that.
                </p>
                <p>
                  Why the blog, you ask. Well, to be honest, I had this idea for
                  some time, as a way to share experiences I found to be
                  interesting or insightful. Not only will it help me write my
                  thoughts down for all eternity, but maybe the information is
                  also helpful to someone else. And that's enough reason, as far
                  as I can think of, to write about something. Expect subjects
                  to vary between computer science and making margaritas. Expect
                  anything, and you will never be disappointed. Or, at least,
                  not surprised.
                </p>
                <figure>
                  <blockquote cite="https://youtu.be/bfDOoADCfkg">
                    <p>
                      <i>
                        Thinking makes you act effectively in the world.
                        Thinking makes you win the battles you undertake, and
                        those could be battles for good things. If you can think
                        and speak and write, you are absolutely deadly. Nothing
                        can get in your way.
                      </i>
                    </p>
                  </blockquote>
                  <figcaption>
                    —Jordan Peterson, <cite>The Power of Writing</cite>
                  </figcaption>
                </figure>
              </section>
            </section>
          </article>
        </header>
        <main>
          <article className={styles.articleInContent}>
            <h2>Education and Internships</h2>
            <section className={styles.sectionContainer}>
              <img
                className={`${styles.sectionImage} ${styles.sectionPortraitImage} ${styles.educationAndInternshipsImage}`}
                alt="silviu wearing sunglasses on the edge of a cliff in the bavarian alps"
                src="/img/pictures/about-mountains-1800w.jpg"
                srcSet="/img/pictures/about-mountains-400w.jpg 400w, /img/pictures/about-mountains-600w.jpg 600w, /img/pictures/about-mountains-800w.jpg 800w, /img/pictures/about-mountains-1000w.jpg 1000w, /img/pictures/about-mountains-1200w.jpg 1200w, /img/pictures/about-mountains-1500w.jpg 1500w, /img/pictures/about-mountains-1800w.jpg 1800w"
                sizes="(max-width: 639px) 100vw, (min-width: 640px) and (max-width: 1019px) 608px, (min-width: 1020px) and (max-width: 1279px) 40vw, (min-width: 1280px) 542px"
              />
              <section
                className={`${styles.sectionContent} ${styles.sectionLargerContent}`}
              >
                <p>
                  I attended the <i>B.P. Hasdeu High School</i> in my hometown
                  of Buzau, finishing with a degree in Mathematics and
                  Informatics, with a special focus on English. I confess that I
                  was not a huge fan of the first two subjects at that time.
                  Consequently, my choice of university was a lucky one, as it
                  turned out in the future. This choice was the{' '}
                  <i>
                    Authomatics and Computers Faculty of the Politechnic
                    University of Bucharest,
                  </i>{' '}
                  from which I graduated in 2015 with a Bachelor of Engineering.
                  Even though I found programming and engineering to be a smart
                  and interesting thing to do at that time, I failed to find
                  much practical meaning into it. It was just too abstract for
                  me.
                </p>
                <p>
                  The meaning of programming and computer science knocked on my
                  door one beautiful day in the spring of 2013. I was accepted
                  at <i>BitDefender</i> for the internship position of Quality
                  Assurance Analyst. It was one of the best moment of my life.
                  There were actual people in an actual company who actually
                  needed me to actually work with them. And they had free coffee
                  and air conditioning in the office. During the amazing summer
                  of 2013 I discovered my passion for automation, as I developed
                  a Java and Batch based solution that tested file transfer
                  between a couple of Android devices, using the transfer
                  application my team was building at the time. They proposed I
                  should stay employed full-time after the internship was over,
                  but sadly I had to turn them down since the third year of
                  college was rumored to be the most demanding of all. The
                  rumors were true.
                </p>
                <p>
                  In 2014 I was accepted for another internship at{' '}
                  <i>Renault Technologie Roumanie</i>, which was not exactly
                  what I expected to be. Even so, I did develop a Java Swing
                  based application that helped the team check some calibration
                  files they used for testing. I was even rewarded a toy car for
                  the app, but sadly I had to give it away after a few weeks 😢.
                  I am still not over that.
                </p>
              </section>
            </section>
          </article>
          <article className={styles.articleInContent}>
            <h2>Software Engineering</h2>
            <section className={styles.sectionContainer}>
              <img
                className={`${styles.sectionImage} ${styles.sectionLandscapeImage} ${styles.softwareEngineeringAdobeImage}`}
                alt="silviu next to an i love bangalore sign"
                src="/img/pictures/about-bangalore-1800w.jpg"
                srcSet="/img/pictures/about-bangalore-400w.jpg 400w, /img/pictures/about-bangalore-600w.jpg 600w, /img/pictures/about-bangalore-800w.jpg 800w, /img/pictures/about-bangalore-1000w.jpg 1000w, /img/pictures/about-bangalore-1200w.jpg 1200w, /img/pictures/about-bangalore-1500w.jpg 1500w, /img/pictures/about-bangalore-1800w.jpg 1800w"
                sizes="(max-width: 639px) 100vw, (min-width: 640px) and (max-width: 1019px) 608px, (min-width: 1020px) and (max-width: 1279px) 50vw, (min-width: 1280px) 612px"
              />
              <section
                className={`${styles.sectionContent} ${styles.sectionSmallerContent}`}
              >
                <p>
                  My first full-time job was at Adobe in 2014 as a Junior
                  Software Engineer in Test. My passion for automation led me to
                  improve
                  <i>Business Catalyst's</i> end-to-end automated testing
                  framework. My best achievement for that project was updating
                  the framework to run the automated tests in parallel, using a
                  Selenium Grid infrastructure. After Business Catalyst, I
                  became a Software Developer in Test for{' '}
                  <i>Adobe Experience Design</i>. There, I helped the team
                  create an automated testing solution from the ground up. There
                  I discovered JavaScript and I honestly fell in love with it.
                </p>
                <p>
                  The testing framework gained traction and I was asked to
                  travel to Bangalore and help ramp up a whole engineering team
                  to write more automated tests for Adobe XD. The experience
                  taught me to take enjoyment in teaching others about the
                  things I'm passionate about. And, most importantly, that
                  sharing knowledge within teams is the key to delivering great
                  results.
                </p>
              </section>
              <img
                className={`${styles.sectionImage} ${styles.sectionPortraitImage} ${styles.softwareEngineeringMicrosoftImage}`}
                alt="silviu in the town of Kutna Hora"
                src="/img/pictures/about-kutna-hora-1800w.jpg"
                srcSet="/img/pictures/about-kutna-hora-400w.jpg 400w, /img/pictures/about-kutna-hora-600w.jpg 600w, /img/pictures/about-kutna-hora-800w.jpg 800w, /img/pictures/about-kutna-hora-1000w.jpg 1000w, /img/pictures/about-kutna-hora-1200w.jpg 1200w, /img/pictures/about-kutna-hora-1500w.jpg 1500w, /img/pictures/about-kutna-hora-1800w.jpg 1800w"
                sizes="(max-width: 639px) 100vw, (min-width: 640px) and (max-width: 1019px) 608px, (min-width: 1020px) and (max-width: 1279px) 40vw, (min-width: 1280px) 542px"
              />
              <section
                className={`${styles.sectionContent} ${styles.sectionLargerContent}`}
              >
                <p>
                  During my automated testing experience, I realised that I
                  enjoyed coding significantly more than testing. I applied for
                  a Software Developer position and received the opportunity to
                  work at Microsoft in the summer of 2017, for one of its most
                  hyped products, <i>Microsoft Teams</i>. This also involved a
                  relocation to Prague, making the experience even more
                  challenging. After working on the Teams AngularJS client for a
                  year, I switched gears to the FluentUI (formerly known as
                  StardustUI) component library, and started to build ReactJS
                  components using TypeScript, prioritising automated testing
                  and accessibility. Joined by a couple of colleagues, I
                  delivered a demo at{' '}
                  <Link href="https://www.csun.edu/cod/conference">
                    CSUN 2019
                  </Link>{' '}
                  about the Microsoft Teams Callings and Meetings experience,
                  along with its accessibility features and support. While
                  working on Fluent I also came into contact with the Downshift
                  npm library and its creator,{' '}
                  <Link href="https://kentcdodds.com/">Kent C Dodds</Link>.
                </p>
                <p>
                  I came back to Bucharest in the infamous year of 2020, and
                  joined Adobe again, this time as a FrontEnd Developer for
                  Adobe Target. I had the opportunity to apply what I learned in
                  terms of accessibility, automated desting and design systems.
                  During that time I had the incredible opportunity to be a
                  speaker at{' '}
                  <Link href="https://www.deque.com/axe-con/">
                    Deque's axe-con
                  </Link>{' '}
                  in 2021, where I presented Downshift's hooks API.
                </p>
                <p>
                  Since 2022 I am a Software Engineer at Bolt, building ReactJS
                  web components to be reused by other teams in their products.
                </p>
              </section>
            </section>
          </article>
          <article className={styles.articleInContent}>
            <h2>Open Source Software</h2>
            <p>
              During my time at Microsoft, while building the <i>Dropdown</i>{' '}
              component for the StardustUI component library, a peer suggested
              we could use{' '}
              <Link href="https://www.downshift-js.com/">downshift 🏎</Link> to
              help us with the component's accessiblity and state handling.
              After using Downshift and creating a few of pull requests with
              improvements for the library, Kent C Dodds, the library creator,
              asked me to maintain it. It was a huge challenge for me, since I
              never maintained an npm library, and Downshift was huge by size. I
              strongly believe that maintaining this library and Kent's trust
              changed my life, and I will be forever grateful for the
              opportunity.
            </p>
            <p>
              Since I started to maintain Downshift, it received a new updated
              docsite based on{' '}
              <Link href="https://docusaurus.io/">docusaurus</Link>, which is,
              incidentally, the same library I used to build this blog with. It
              also offeres a new ARIA 1.2 compatible API based on React hooks
              for select, combobox and taglist components. The hooks API was
              showcased live at axe-con 2021, which was the first conferance I
              was a speaker by myself.
            </p>
            <p>
              Apart from Downshift, I also contributed to other open source
              projects that were related to my work, such as CypressIO and
              Testing Library.
            </p>
          </article>
          <article className={styles.articleInContent}>
            <h2>Hobbies</h2>
            <section className={styles.sectionContainer}>
              <img
                className={`${styles.sectionImage} ${styles.sectionPortraitImage} ${styles.hobbiesCapuccinoImage}`}
                alt="cup of capuccino with a swann drawn as latte art"
                src="/img/pictures/about-capuccino-1800w.jpg"
                srcSet="/img/pictures/about-capuccino-400w.jpg 400w, /img/pictures/about-capuccino-600w.jpg 600w, /img/pictures/about-capuccino-800w.jpg 800w, /img/pictures/about-capuccino-1000w.jpg 1000w, /img/pictures/about-capuccino-1200w.jpg 1200w, /img/pictures/about-capuccino-1500w.jpg 1500w, /img/pictures/about-capuccino-1800w.jpg 1800w"
                sizes="(max-width: 639px) 100vw, (min-width: 640px) and (max-width: 1019px) 608px, (min-width: 1020px) and (max-width: 1279px) 40vw, (min-width: 1280px) 542px"
              />
              <section
                className={`${styles.sectionContent} ${styles.sectionSmallerContent} ${styles.hobbiesContent}`}
              >
                <p>
                  I spend my free time mostly trying to be active. I enjoy
                  running 🏃‍♂️ during mornings, going the gym 🏋️‍♂️, playing
                  basketball 🏀 and hiking 🥾. In addition to that, I'm also
                  dancing salsa and bachata 🕺💃, which is probably the best
                  hobby to have, period.
                </p>
                <p>
                  When I'm at home, I use my{' '}
                  <Link href="https://www.sageappliances.com/uk/en/products/espresso/bes878.html">
                    espresso machine
                  </Link>{' '}
                  to make flat whites with latte art. If it's past 11:00 AM I
                  switch to espresso or americano, in order to comply with the
                  Italian law. I love coffee. Also long drinks and cocktails 🍸,
                  and I mix some of them myself. Probably my go to is a
                  Margarita or a Martini. Sometimes I cook, usually pasta 🍝 or
                  banana bread.
                </p>
                <p>
                  I like reading history and the classics 📚. Some of my
                  favorite books are <i>A Picture of Dorian Gray</i>,{' '}
                  <i>The Idiot</i> and <i>The History of the Ancient World</i>.
                  The first books I bought for myself is the{' '}
                  <i>A Song of Ice and Fire</i> collection. That was back in the
                  summer of 2013, and I look forward to buy the next ones as
                  well. Please, George.
                </p>
              </section>
              <img
                className={`${styles.sectionImage} ${styles.sectionPortraitImage} ${styles.hobbiesMargaritaImage}`}
                alt="glass of frozen strawberry margarita with a lime wedge garnish"
                src="/img/pictures/about-margarita-1800w.jpg"
                srcSet="/img/pictures/about-margarita-400w.jpg 400w, /img/pictures/about-margarita-600w.jpg 600w, /img/pictures/about-margarita-800w.jpg 800w, /img/pictures/about-margarita-1000w.jpg 1000w, /img/pictures/about-margarita-1200w.jpg 1200w, /img/pictures/about-margarita-1500w.jpg 1500w, /img/pictures/about-margarita-1800w.jpg 1800w"
                sizes="(max-width: 639px) 100vw, (min-width: 640px) and (max-width: 1019px) 608px, (min-width: 1020px) and (max-width: 1279px) 40vw, (min-width: 1280px) 542px"
              />
            </section>
          </article>
        </main>
      </div>
    </Layout>
  )
}
