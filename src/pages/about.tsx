import React from 'react'
import Layout from '@theme/Layout'
import styles from './about.module.css'
import Link from '@docusaurus/Link'

export default function About() {
  return (
    <Layout title="About Silviu" description="A few words about the author">
      <div className={styles.mainContainer}>
        <h1>Welcome to my blog!</h1>
        <header>
          <article className={styles.aboutTheAuthor}>
            <section>
              <h2>About the author</h2>
              <p>
                Hi, I'm Silviu, and I'm a software engineer 👨‍💻. When I'm not
                coding, I spend my time playing basketball 🏀, salsa dancing 🕺
                and drinking cofee ☕️. I also drink coffee when coding, so
                there's that.
              </p>
              <p>
                I started this blog as a way to write down important things that
                I consider worth sharing. Once I'll solve an interesting coding
                challenge, I will write about it. After joining a cool
                conference with super useful content, make sure you'll receive a
                blog post about it. And as soon as I will discover the perfect
                Margarita recipe, it's going to get patented 💰.
              </p>
            </section>
            <img
              className={`${styles.sectionImageEnd} ${styles.aboutImg}`}
              alt="silviu sitting in front of to the fountain in piazza de ferrari in genoa"
              src="/img/pictures/silviu_about_the_author.jpg"
              width="360"
            />
          </article>
        </header>
        <main>
          <article
            className={`${styles.educationAndInternships} ${styles.articleInContent}`}
          >
            <section>
              {' '}
              <img
                className={styles.sectionImageEnd}
                alt="silviu wearing sunglasses on the edge of a cliff in the bavarian alps"
                src="/img/pictures/silviu_college_alps.jpg"
              />
            </section>
            <section>
              <h2>Education and Internships</h2>
              <p>
                I attended the <i>B.P. Hasdeu High School</i> in Buzau,
                finishing the class of Mathematics and Informatics, with a
                special focus on English. I confess that I was not a huge fan of
                the first two at that time. Consequently, my choice of college
                was a lucky one, as it turned out in the future. The choice was
                the{' '}
                <i>
                  Authomatics and Computers Faculty of the Politechnic
                  University of Bucharest.
                </i>{' '}
                Even though I found programming and engineering smart and
                interesting at that time, I as not very sure about everything,
                since I failed to find much meaning into it.
              </p>
              <p>
                The meaning of programming and computer science came one
                beautiful spring day in 2013. I was accepted at{' '}
                <i>BitDefender</i> for the internship position of Quality
                Assurance Analyst. It was one of the best moment of my life, as
                people in a company actually needed me to work for them. And
                they paid. And they had free coffee. During that amazin summer I
                discovered my passion for automation, as I developed a Java and
                Batch based script that tested file transfer between a couple of
                Android devices, using the application we were supposed to test.
                They proposed I should stay employed after the internship was
                over, but sadly I had to refuse since third year of college was
                rumored to be the most demanding of all.
              </p>
              <section className={styles.renaultInternship}>
                <p>
                  In 2014 I was accepted for another internship at{' '}
                  <i>Renault Technologie Roumanie</i>, which was not exactly
                  what I expected to be. Even so, I did developed a Java Swing
                  based application that helped the team check some calibration
                  files they used for testing. Was even rewarded a toy car for
                  the app, but sadly I had to give it away after a few weeks 😢.
                </p>
                <img
                  className={styles.sectionImageEnd}
                  alt="silviu holding a toy car trophy and smiling"
                  src="/img/pictures/silviu_toy_car.jpg"
                />
              </section>
            </section>
          </article>
          <article className={styles.articleInContent}>
            <h2>Software Engineering</h2>
            <section className={styles.adobeBangalore}>
              <p>
                My first full time job was at Adobe in 2014 as a Junior Software
                Engineer in Test. My interest for automation led me to improve
                <i>Business Catalyst's</i> end-to-end automated testing
                framework. My best achievement for that project was updating the
                framework to run the automated tests in parallel, using a
                Selenium Grid infrastructure. After Business Catalyst, I became
                a Software Developer in Test for <i>Adobe Experience Design</i>,
                where I helped the team create an automated testing solution
                from the ground up. There I discovered JavaScript and I honestly
                fell in love with it. The testing framework became so important
                that I was asked to travel to Bangalore and ramp up a whole team
                to write more automated tests for XD.
              </p>
              <img
                className={styles.sectionImageEnd}
                alt="silviu next to an i love bangalore sign"
                src="/img/pictures/silviu_bangalore.jpg"
                width={480}
              />
            </section>
            <section className={styles.microsoftPrague}>
              <img
                className={styles.sectionImageStart}
                alt="silviu in the Čzesky Krumlov castle"
                src="/img/pictures/silviu_czechia.jpg"
                height={480}
              />
              <section>
                <p>
                  During my automated testing experience, I realised that I
                  enjoyed coding more than testing. Consequently, I applied for
                  a Software Developer position and received the opportunity to
                  work at Microsoft in the summer of 2017, on one of it's most
                  important products, <i>Microsoft Teams</i>. It also involved a
                  relocation to Prague, which made the challenge even more
                  daunting. After working on the Teams AngularJS client for a
                  year, I switched gears to FluentUI (formerly known as
                  Stardust), and started to build ReactJS components in
                  TypeScript, with automated testing and accessibility in mind.
                  Joined by a couple of colleagues, I delivered a demo at{' '}
                  <Link href="https://www.csun.edu/cod/conference">
                    CSUN 2019
                  </Link>{' '}
                  about Teams' Callings and Meetings functionality, along with
                  its accessibility features and support. While working on
                  Fluent I also came into contact with the Downshift npm library
                  and its creator,{' '}
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
          <article>
            <h2>Open Source Software</h2>
            <p>
              During my tenure at Microsoft, when building the <i>Dropdown</i>{' '}
              component for the Stardust component library, someone suggested we
              could use{' '}
              <Link href="https://www.downshift-js.com/">downshift 🏎</Link> to
              build it in an accessible way. After using it and creating a few
              of pull requests with improvements for the library, Kent C Dodds,
              the library creator, asked me to maintain it. It was a huge
              challenge since I never in my life maintained an npm library, and
              Downshift was huge by size. I strongly believe that maintaining
              this library and Kent's trust changed my life, and I will be
              forever grateful for the opportunity.
            </p>
            <p>
              Since I started to maintain Downshift, ot received a new updated
              docsite based on{' '}
              <Link href="https://docusaurus.io/">docusaurus</Link>, which is,
              incidentally, the same library I used to build this blog with. It
              also offeres a new ARIA 1.2 compatible API based on React hooks
              for select, combobox and taglist components. The hooks API was
              showcased live at axe-con 2021, which was the first conferance I
              was a speaker by myself.
            </p>
            <p>
              Apart from Downshift, I also had some contributions to other open
              source projects that were related to my work, such as CypressIO
              and Testing Library.
            </p>
          </article>
          <article>
            <h2>Hobbies</h2>
            <section>
              <p>
                I spend my free time mostly trying to be active. I run 🏃‍♂️ most
                mornings, hit the gym 🏋️‍♂️ at least twice a week and play
                basketball 🏀 whenever I can. Recently I am also taking salsa
                and bachata dancing lessons 🕺💃, which is probably the most fun
                thing to do.
              </p>
              <section className={styles.drinks}>
                <img
                  className={styles.sectionImageStart}
                  alt="silviu in the Čzesky Krumlov castle"
                  src="/img/pictures/silviu_margarita.jpg"
                />
                <p>
                  When I'm at home, I use my{' '}
                  <Link href="https://www.sageappliances.com/uk/en/products/espresso/bes878.html">
                    espresso machine
                  </Link>{' '}
                  to make flat whites with latte art. I don't shy away from
                  espresso, americano or iced latte. I love coffee. Also long
                  drinks and cocktails 🍸, and I mix some of them myself.
                  Probably my go to is a Margarita or a Martini. And as for
                  cooking, I usually do pasta 🍝 and banana bread.
                </p>
                <img
                  className={styles.sectionImageEnd}
                  alt="silviu in the Čzesky Krumlov castle"
                  src="/img/pictures/silviu_coffee.jpg"
                  width={400}
                />
              </section>
            </section>
          </article>
        </main>
      </div>
    </Layout>
  )
}
