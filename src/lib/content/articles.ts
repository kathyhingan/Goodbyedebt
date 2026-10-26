// AUTO-GENERATED from debt-app-seo-icm/03-content-strategy/output/articles/*.md.
// Regenerate: python scripts/gen_articles.py <articles_dir> src/lib/content/articles.ts
// Metadata (description, kicker, ctaLead, ctaSub) comes from meta.json in the articles dir.

export interface GuideSection { heading: string; paragraphs: string[]; bullets?: string[] | null; numbered?: string[] | null; subheadings?: { text: string; paragraphs: string[] }[] | null; table?: { headers: string[]; rows: string[][] } | null; }
export interface GuideFaq { q: string; a: string; }
export interface GuideResource { label: string; blurb: string; href: string; cta: string; }
export interface GuideArticleData {
  slug: string; title: string; description: string; kicker: string; tldr: string;
  sections: GuideSection[]; faq: GuideFaq[]; ctaLead: string; ctaSub: string;
  resource?: GuideResource | null;
}

export const ARTICLE_LIST: GuideArticleData[] = [
  {
    "slug": "which-debt-to-pay-off-first",
    "title": "Which Debt Should You Pay Off First? Snowball vs Avalanche for Filipino Debts",
    "description": "Avalanche vs snowball explained with real Philippine lender rates, and why the method only works once every debt is visible in one place.",
    "kicker": "Snowball vs avalanche",
    "tldr": "Pick avalanche (highest interest first) to pay the least total interest. Pick snowball (smallest balance first) if you need quick wins to stay motivated. Either way, the method only works once you can see every debt side by side, which most people trying this by hand never actually get to.",
    "sections": [
      {
        "heading": "The real problem is not the method, it is that you cannot see all your debts at once",
        "paragraphs": [
          "Every article on this topic, and there are a few now, starts with the same two definitions: avalanche attacks the highest interest rate first, snowball attacks the smallest balance first. That part is not the hard part. The hard part is that almost nobody doing this by hand actually has all their numbers in one place at the same time.",
          "Say you have a Tala loan, a BDO credit card, and an SSS salary loan. Each one lives in a different app or a different physical bill. The Tala app shows your Tala balance. Your bank app shows your card. Your SSS contribution record shows the salary loan, if you even check it. None of them show you the other two. So \"which debt should I pay off first\" turns into a guess made from memory, usually the guess that whichever bill is shouting loudest this week (the one that just sent a collection text) wins, regardless of what it is actually costing you.",
          "That is the gap this piece is here to close: not just explain the two methods, which takes four paragraphs, but show you what changes once you can actually see the whole picture at once."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Avalanche, explained with real Philippine numbers",
        "paragraphs": [
          "Avalanche means: pay the minimum on every debt, then throw every extra peso at whichever debt has the highest interest rate. Once that one is gone, move to the next highest rate. Repeat.",
          "Here is why rate order matters so much in the Philippines specifically. Monthly rates on common Filipino debts are not close to each other the way they might be in a country where everyone borrows from a bank. A rough, commonly cited range looks like this:",
          "(These are commonly published ranges, not a guarantee of what any specific account charges you today. Check your own statement. Rates change and vary by lender and by borrower.)",
          "Look at that spread. A Tala loan at 11 to 12 percent a month effective is not slightly more expensive than an SSS salary loan at roughly 0.8 percent a month, it is more than ten times more expensive, every single month, for as long as the balance sits there. If you have both and you are putting extra money toward the SSS loan because it feels responsible to pay the \"official\" one first, the Tala balance is quietly costing you far more while you do that.",
          "Avalanche says: ignore which one feels more official, which one is smaller, or which one sent the scariest text this week. Rank every debt by its actual monthly rate, and send every extra peso to the top of that list. Mathematically, this is the method that gets you to zero debt for the least total interest paid, full stop."
        ],
        "bullets": [
          "SSS salary loan: around 0.8 to 1 percent a month",
          "Pag-IBIG Multi-Purpose Loan: around 0.85 to 1 percent a month",
          "Bank personal loan: around 1.5 to 2 percent a month",
          "Credit card (BSP cap): up to 3 percent a month on the unpaid balance",
          "Home Credit, BillEase, Cashalo type installment loans: often 3 to 4 percent a month",
          "GCash GCredit: about 4.15 percent a month",
          "Tala: 11 to 12 percent a month effective, per its own published disclosure"
        ],
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Snowball, explained with the same numbers",
        "paragraphs": [
          "Snowball ignores interest rate completely and instead ranks debts from smallest balance to largest. You pay the smallest one off first, no matter its rate, then take the payment you were making on it and add it to the next smallest, and so on. Each payoff makes the next one faster, which is where the name comes from.",
          "Using the same three debts: if your Tala loan is only 8,000 pesos, your SSS salary loan is 20,000, and your credit card is 45,000, snowball says clear the 8,000 first even though it has the highest rate. The reason people choose this anyway is not that they do not understand the math. It is that clearing an entire account, start to finish, in month two of a plan, is a real psychological reset. It proves the plan works, on a debt you can actually see disappear, not just a number that drops a little every month for two years.",
          "The honest trade-off: snowball almost always costs more total interest than avalanche, because you are letting a higher-rate debt sit longer while you clear smaller, cheaper ones first. The size of that gap depends on your numbers. Sometimes it is small. Sometimes, if your smallest balance is also your lowest rate (common with SSS and Pag-IBIG loans, since government loan amounts tend to be modest), snowball and avalanche land on nearly the same order anyway, and the \"which one\" question barely matters."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Which one is actually right for you",
        "paragraphs": [
          "Neither method is correct in the abstract. The honest version of this advice is:",
          "That last point is the one almost no generic article tells you, because almost no generic article can actually run your numbers. They explain the concept and leave you to do the math yourself, on debts spread across three apps and a drawer of paper bills."
        ],
        "bullets": [
          "If you have stopped a debt payoff plan before, and the reason was that progress felt invisible, pick snowball. The quick win is the plan.",
          "If your highest-rate debt is also a large balance (a maxed credit card, for instance) and letting it ride even one more month genuinely costs real money, pick avalanche.",
          "If you are not sure, run both and look at the actual difference in total interest and in months to debt-free. For a lot of real debt combinations, the gap between the two is smaller than people assume, and in that case picking whichever one you will actually stick with wins."
        ],
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Why most advice on this topic stops at \"it depends\"",
        "paragraphs": [
          "Search this exact question and you will find real, well-written explanations of snowball versus avalanche written for a Filipino audience. Some of them are genuinely good. What none of them do is let you plug in your own three, four, or five debts and see your own answer in the next ten minutes, with your own numbers, not an illustrative example written by someone who has never seen your statements.",
          "A couple of Filipino debt-tracking apps come closer: they will calculate a payoff order inside the app itself once you have downloaded it and entered everything. That is a real, useful thing those apps do, and if an app-based tracker with a community feature or a lender-review database fits what you need, it is worth looking at. But an explainer article that only explains, with no way to see your own plan on the same page you are reading, leaves you back where you started: understanding the theory, still guessing at your own order."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "See your own plan, not an example",
        "paragraphs": [
          "You do not have to take any of that on faith, either: the calculator below runs right here on this page. It comes preloaded with the three example debts from the sections above, and you can edit the balances, rates, and payments, add a fourth debt, and watch both orders recompute instantly. Nothing you type is saved or sent anywhere; it is a quick sandbox for seeing your own situation instead of imagining it.",
          "This is the part most articles cannot do and Goodbye Debt was built specifically to do: add your real debts, in the free plan if you have two or fewer, and see your actual avalanche-ordered payoff plan in the time it takes to read this far. No bank linking. Manual entry or a CSV if you already have your balances in a spreadsheet. No card required, and nothing to pay, before you see the plan.",
          "What you get on the free plan: the full avalanche engine running on your two biggest debts, your projected debt-free date, and the real interest difference between your current plan and doing nothing differently. That is the entire point of \"see the math before you decide anything\": the numbers come first, every time, and what you do with them after that is up to you."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "What if I have three or more debts, or want to compare snowball too",
        "paragraphs": [
          "The free plan runs avalanche on your two biggest debts. If you are juggling a Tala loan, a credit card, and an SSS salary loan, that is already three, and this is exactly the situation where guessing costs you the most, because the spread between a 5 percent app loan and a 0.8 percent government loan is the single biggest lever in your whole plan.",
          "The paid tier removes the two-debt limit and adds snowball and a custom hybrid strategy, so you can compare all three methods side by side on your actual numbers instead of taking a stranger's word for which one fits your situation. It also adds bulk CSV import if you are tracking several accounts already, and a what-if simulator so you can test \"what happens if I add 2,000 pesos a month\" before you commit to it."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "You are not the only one doing this right now",
        "paragraphs": [
          "Part of what makes a payoff plan hard to stick to is that it can feel like a private, slightly embarrassing project. Goodbye Debt's community, Debt Slayers, exists because the opposite is true: a meaningful number of people are working through exactly this, at the same time, and sharing a progress percentage with people who are not going to judge the number. Nobody in that community is further along by accident. They are further along because they picked a method and an order, and stuck with it."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      }
    ],
    "faq": [
      {
        "q": "Is avalanche or snowball better for Filipino debts specifically?",
        "a": "Avalanche usually saves more total interest because of how wide the rate gap can be here, for example between a government salary loan and an app-based lending platform. Snowball usually wins on consistency because clearing a full account fast feels like proof the plan works. If you are not sure which matters more to you, running both on your real numbers and comparing the actual peso difference is faster than debating it in the abstract."
      },
      {
        "q": "Do I need to close my smallest debt first even if it has a low interest rate?",
        "a": "Only if you are using snowball on purpose, for the motivation effect. If your goal is minimizing total interest paid, a low-rate small debt should usually wait behind a high-rate debt of any size, which is exactly what avalanche is for."
      },
      {
        "q": "What if two of my debts have almost the same interest rate?",
        "a": "Then the order between those two barely affects your total interest, and you can safely break the tie by paying off whichever one is smaller first, which gets you a quick win without meaningfully changing your total cost. This is a common real-world case where snowball and avalanche effectively agree."
      },
      {
        "q": "Can I switch strategies partway through my plan?",
        "a": "Yes. A hybrid approach, clearing one or two small debts first for momentum, then switching to strict avalanche for the rest, is a normal and reasonable way to run this. The paid tier's custom hybrid mode is built for exactly this kind of mixed approach."
      },
      {
        "q": "Does this work if some of my debt is informal, like money owed to a relative or a 5-6 lender?",
        "a": "You can enter any debt with a balance and a rate, including an estimated rate on an informal loan. The math works the same way regardless of who the lender is. What the method cannot do is make an informal lender agree to a payment schedule; that conversation is still yours to have."
      }
    ],
    "ctaLead": "See your own payoff order, free",
    "ctaSub": "Add your real debts and see your avalanche-ordered plan, your projected debt-free date, and the interest you would save. No bank linking, manual entry or a CSV, and nothing to pay before you see the numbers."
  },
  {
    "slug": "debt-consolidation",
    "title": "Is Debt Consolidation Worth It in the Philippines? What It Actually Costs",
    "description": "When a consolidation loan genuinely helps, when it quietly hurts, and what avalanche order gets you without a new loan.",
    "kicker": "What consolidation actually costs",
    "tldr": "Debt consolidation only helps if the new loan's rate is clearly lower than what you are paying now, and you still qualify for that lower rate after your current debt is already counted against you. Often, running your existing debts through avalanche order gets you most of the same savings without taking on a new loan at all.",
    "sections": [
      {
        "heading": "What debt consolidation actually is",
        "paragraphs": [
          "Debt consolidation means taking out one new loan, ideally at a lower interest rate, and using it to pay off several existing debts at once. Afterward you owe one lender instead of three or four, on one due date instead of several. The appeal is obvious: fewer bills to track, one payment to remember, and in theory a lower total cost.",
          "The part that gets skipped in most explanations is the word \"in theory.\" Consolidation is not automatically cheaper. It is cheaper only under specific conditions, and it can quietly cost you more if those conditions are not met."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The real cost comparison, with real Philippine rates",
        "paragraphs": [
          "Here is what consolidation is actually competing against. Commonly cited monthly rate ranges on debt Filipinos typically carry:",
          "(These are commonly published ranges, not guaranteed figures for any specific account. Lenders set their own rates and they move over time. Check your actual statement before deciding.)",
          "Now look at what a consolidation loan is realistically priced at: a bank personal loan, which sits at roughly 14 to 18 percent a year. If your current mix of debt is mostly credit cards at 36 percent and app loans at 4 to 15 percent a month depending on the lender, consolidating into a 14 to 18 percent personal loan is a real, meaningful savings. If your current mix is mostly an SSS salary loan and a Pag-IBIG loan, both already under 11 percent, consolidating them into a personal loan at 14 to 18 percent would make your situation worse, not better. People do this by accident more often than you would expect, because the pitch (\"one payment, lower rate\") sounds universally true when it is actually conditional on what you already owe."
        ],
        "bullets": [
          "SSS salary loan or SSS Conso-Loan: roughly 10 percent a year",
          "Pag-IBIG Multi-Purpose Loan: roughly 10 to 10.5 percent a year",
          "Bank personal loan (the usual consolidation product): roughly 14 to 18 percent a year",
          "Credit card: capped by the BSP at 3 percent a month, which is 36 percent a year",
          "BNPL and installment apps (Home Credit, BillEase, Cashalo): typically 3 to 4 percent a month, at or above the card's cap on an annualized basis",
          "GCash GCredit: about 4.15 percent a month",
          "Tala: 11 to 12 percent a month effective, per its own published disclosure"
        ],
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The part the sales pitch leaves out",
        "paragraphs": [
          "A consolidation loan is a new credit application. That means:",
          "None of this means consolidation is a bad idea. It means it is a decision that deserves the actual numbers, not the pitch."
        ],
        "bullets": [
          "A new credit check, which can be harder to pass the deeper in debt you already are. The applicants who need consolidation most are sometimes the ones least likely to qualify for a good rate.",
          "Processing time, typically days to a few weeks, during which your existing debts keep accruing interest and due dates as normal.",
          "Possible processing or origination fees on the new loan, which eat into whatever rate advantage you were expecting.",
          "A real risk, well documented in how people actually use consolidation loans: the old credit cards get paid off, then slowly used again, because the card is still open and the temptation is still there. Now you have the new consolidation loan AND a refreshed credit card balance. This is the single most common way consolidation makes things worse instead of better."
        ],
        "numbered": null,
        "subheadings": null,
        "table": {
          "headers": [
            "Your situation",
            "Does consolidation help?"
          ],
          "rows": [
            [
              "Mostly credit card and app loan debt, and you qualify for 14 to 18 percent",
              "Yes, a real and meaningful savings"
            ],
            [
              "Mostly an SSS or Pag-IBIG loan already under 11 percent a year",
              "No, folding cheap debt into a pricier blended rate costs you more"
            ],
            [
              "Cannot qualify for a rate lower than what you already pay",
              "No, avalanche order or a restructuring call is the realistic path"
            ],
            [
              "Planning to keep the old cards in your wallet after the loan pays them off",
              "Do not consolidate until that changes; the refreshed card is how consolidation backfires"
            ]
          ]
        }
      },
      {
        "heading": "What avalanche order gets you without a new loan",
        "paragraphs": [
          "Here is the comparison nobody selling a consolidation loan will walk you through: running your existing debts in avalanche order, highest rate first, with no new loan, no credit check, and no risk of refreshing a paid-off card.",
          "Take a representative mix: a Tala loan at 11 to 12 percent a month effective, a credit card at 3 percent a month (the BSP cap), and an SSS salary loan at under 1 percent a month. Avalanche order means every extra peso goes to the Tala loan first, specifically because it is costing you roughly five times more per month than the SSS loan. Once it is cleared, the freed-up payment rolls into the credit card. The SSS loan, already cheap, gets paid down last, on schedule.",
          "Compare the result: a consolidation loan at 14 to 18 percent replacing all three accounts would mean paying 14 to 18 percent on money that was costing you under 1 percent a month (the SSS loan) for the entire life of the new loan. Avalanche order never does that. It only ever concentrates extra payment on the most expensive balance, and leaves the cheap debt exactly where it is, cheap.",
          "This is not an argument that consolidation never makes sense. When most of your balance really is sitting in high-rate revolving debt (cards, BNPL, app loans) and you can genuinely qualify for a meaningfully lower consolidation rate, it can be the right call. The point is that \"I have multiple debts\" is not, by itself, a reason to consolidate. \"My debts are mostly high-rate and I can get approved for something clearly lower\" is the actual reason, and most people never check whether that is true for their specific numbers before applying."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Running the actual numbers on a real example",
        "paragraphs": [
          "Take a reader with three debts: a 150,000 peso credit card balance at the BSP-capped 3 percent a month, a 60,000 peso Tala-style app loan at 11 to 12 percent a month effective, and a 100,000 peso SSS salary loan at under 1 percent a month, total debt 310,000 pesos. Two paths, assuming 15,000 pesos a month available above minimums:",
          "Path one, a consolidation loan at 16 percent a year (roughly 1.33 percent a month), replacing all three: the blended rate on the new loan is a flat 1.33 percent a month on the full 310,000. That is a clear improvement over the credit card and the app loan's rates, but it is more than the SSS loan's own rate, meaning the 100,000 pesos that used to cost under 1 percent a month now costs 1.33 percent a month for the life of the new loan, a real increase on that portion.",
          "Path two, avalanche order with no new loan: the 15,000 pesos a month goes entirely to the Tala-style loan first, since its rate is by far the most expensive. Once it clears, the freed payment rolls to the credit card. The SSS loan continues at its own low rate the whole time, untouched by any new, higher blended rate.",
          "The exact total interest difference depends on your real payoff timeline, which is the entire reason to run your own numbers rather than someone else's example. But the direction of the comparison holds for almost anyone in a similar mix: consolidating a cheap government loan into a pricier blended rate works against you, even while the same consolidation genuinely helps the expensive app loan and card balance it is also absorbing."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "How to tell if you would actually qualify for a meaningfully lower rate",
        "paragraphs": [
          "Before applying anywhere, add up your current balances and rates, and calculate your own blended rate: total monthly interest across every debt, divided by total balance. That number is the rate a consolidation loan needs to beat to be worth doing at all. Banks price personal loans based on your income, existing obligations, and credit history, the same factors that got you into multiple debts in the first place, so there is no guarantee the rate you are quoted beats your blended rate. Asking for a rate quote costs nothing and does not obligate you to proceed; comparing that quoted rate against your own blended number, calculated honestly beforehand, is the actual decision point."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "See the math before you apply for anything",
        "paragraphs": [
          "This is exactly the comparison Goodbye Debt's free plan is built to show you before you commit to anything: see your avalanche-ordered payoff plan, your projected debt-free date, and the actual interest you would pay under your current accounts. No bank linking, manual entry or a CSV, nothing to pay before you see the numbers. If your own math shows avalanche getting you to debt-free in a reasonable timeline without taking on a new loan, you have your answer without ever submitting a consolidation application. If the gap is wide enough that consolidation would genuinely help, you will see that in the numbers too, and you can go into that application knowing exactly what rate you need to beat."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      }
    ],
    "faq": [
      {
        "q": "Is debt consolidation always cheaper than paying debts separately?",
        "a": "No. It is cheaper only when the new loan's rate is clearly lower than the weighted average of what you currently owe. If part of your existing debt is already low-rate (an SSS or Pag-IBIG loan, for example), folding it into a higher-rate consolidation loan can increase what you pay on that portion."
      },
      {
        "q": "Will debt consolidation hurt my credit standing?",
        "a": "Applying for a new loan involves a credit check, which is a normal part of any loan application and not unique to consolidation. What matters more for your standing afterward is whether you keep the old accounts you consolidated at a zero balance, rather than using them again on top of the new loan."
      },
      {
        "q": "Can I consolidate an app loan like Tala or GCredit into a bank loan?",
        "a": "Generally yes, the bank loan proceeds are yours to use however you choose, including paying off app loans directly. Approval and the rate you get still depend on your income and credit history, the same as any personal loan application."
      },
      {
        "q": "What if I cannot qualify for a lower rate than what I already have?",
        "a": "Then consolidation does not help you, and this is common for people who are already struggling, since lenders price risk into the rate they offer. In that case, running your current debts in avalanche order, or negotiating a hardship restructuring directly with your existing bank or card issuer, is usually the more realistic path."
      },
      {
        "q": "Is there a faster way to compare consolidation against my current plan?",
        "a": "Running your actual balances and rates through a payoff calculator takes about the same time as filling out a consolidation loan's pre-qualification form, and it shows you the comparison before you apply anywhere, not after."
      }
    ],
    "ctaLead": "See your own payoff order, free",
    "ctaSub": "Add your real debts and see your avalanche-ordered plan, your projected debt-free date, and the interest you would save. No bank linking, manual entry or a CSV, and nothing to pay before you see the numbers."
  },
  {
    "slug": "jail-for-unpaid-debt",
    "title": "Can You Go to Jail for Unpaid Debt in the Philippines?",
    "description": "The constitutional ban on debt imprisonment, the three real criminal exceptions, and what collectors cannot legally do.",
    "kicker": "The real law, explained calmly",
    "tldr": "No. The 1987 Constitution directly bans imprisonment for ordinary debt. You can only face criminal charges if separate conduct is involved, mainly a bounced check or proven fraud at the time you got the loan, not simply being unable to pay it back later.",
    "sections": [
      {
        "heading": "The one sentence that settles this",
        "paragraphs": [
          "Article III, Section 20 of the 1987 Philippine Constitution states: \"No person shall be imprisoned for debt or non-payment of a poll tax.\" That is not a loophole or a technicality. It is a direct constitutional guarantee, and the Supreme Court has upheld it consistently. A credit card balance, a personal loan, an app loan like Tala or GCredit, money borrowed from a bank: all of these are civil obligations. Being unable to pay one, by itself, cannot put you in jail, no matter how many collection calls or texts tell you otherwise.",
          "If a collector, a text message, or even a legitimate-sounding letter threatens arrest or imprisonment over an unpaid balance alone, that threat does not describe how Philippine law actually works. It describes a pressure tactic."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "When debt actually can become a criminal matter",
        "paragraphs": [
          "Three situations turn an ordinary debt problem into something a prosecutor can act on. All three require something beyond simply not paying.",
          "Issuing a check that bounces: Batas Pambansa 22, the Bouncing Checks Law. If you write a post-dated check to pay a loan or credit card bill, and that check is later dishonored because the account did not have enough funds, BP 22 can apply. The penalty is a fine up to double the check's amount, capped at 200,000 pesos, or imprisonment of 30 days to a year, or both. The Supreme Court case Lozano v. Martinez (1986) established why this holds up against the constitutional ban on debt imprisonment: BP 22 punishes the act of issuing a bad check, not the underlying debt itself. Courts are also directed to favor a fine over jail time where possible, and many cases settle once the check amount is paid.",
          "Estafa, swindling under Article 315 of the Revised Penal Code. This is the one most often misunderstood. Estafa requires proof of fraud or deceit that existed at the time you got the loan or credit, not frustration from a creditor after you later could not pay. If you borrowed in good faith, intending to repay, and your circumstances changed, that is a civil matter, not estafa, even if you eventually default. Philippine courts have repeatedly ruled this way. Estafa applies to cases like using fake income documents to get approved, or a paluwagan organizer who takes contributions and never intends to pass them along.",
          "Credit card fraud under RA 8484, the Access Devices Regulation Act. This law exists specifically for credit cards, and it is explicit that ordinary non-payment is not a violation. Criminal liability only arises from things like using a stolen or counterfeit card, applying with false identity documents, or (a specific trigger worth knowing) abandoning your stated address or job without notice while more than 10,000 pesos is past due for over 90 days, which the law treats as evidence of intent to defraud. Simply falling behind on a card you honestly applied for and used does not trigger this law."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "What this means if a collector is threatening you right now",
        "paragraphs": [
          "If you are behind on a Tala loan, a credit card, a bank personal loan, or any similar debt, and the messages you are receiving threaten jail, warrants, or police action over the unpaid amount itself: that threat is not an accurate description of the law, in the overwhelming majority of cases. The actual civil remedy available to a lender is to sue you for collection in civil court and pursue your assets through a judgment, not your liberty.",
          "There is a separate, real problem worth naming directly: harassment. Some online lending apps and informal collectors cross into illegal territory by contacting your family, your employer, or your phone contacts, or by threatening to post your information publicly. This is banned under the Data Privacy Act (RA 10173) and SEC Memorandum Circular 18-2019, which specifically prohibits contact blasting and public shaming by lending platforms, regardless of whether you actually owe the money. If this is happening to you, documenting it (screenshots, call logs) is worth doing for your own protection, separately from whatever you decide about the debt itself."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The one real exception: writing checks",
        "paragraphs": [
          "If any part of your current debt involves post-dated checks you have already issued, that is the one place this article's reassurance narrows. A bounced check carries real BP 22 exposure, separate from the constitutional protection on debt itself. If you have outstanding post-dated checks tied to a loan you may not be able to cover, talking to the lender about restructuring before a check is presented and bounces is a meaningfully different, safer position than letting it happen and dealing with the aftermath."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "What actually happens if you simply cannot pay",
        "paragraphs": [
          "Removing the jail threat does not mean there are no consequences, and the honest version of this article covers that too. The real civil path a lender can take looks like this: the account goes delinquent, collection calls and letters follow, and if it stays unpaid long enough, the lender (or a collection agency it sells or assigns the account to) can file a civil case for a sum of money. For many personal debts, this can go through Small Claims Court, a simplified process under Supreme Court rules where no lawyer is required and cases move faster than ordinary civil litigation. If the court rules against you, the result is a judgment: a legal order that you owe the amount, which the winning creditor can enforce against your assets, commonly through garnishment of money owed to you or attachment of specific property, never through imprisonment.",
          "That path is slower, more procedural, and far less dramatic than the \"you will be arrested\" messages suggest, which is itself useful to know: it gives you time to negotiate, restructure, or build a payoff plan before a case ever reaches a courtroom, something collectors relying on fear rarely mention."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Hardship restructuring: the option collectors rarely lead with",
        "paragraphs": [
          "Philippine banks, under BSP guidance, commonly offer hardship or restructuring programs for borrowers in genuine difficulty: a reduced interest rate, sometimes close to 0 percent for a fixed period, an extended term, or temporarily paused penalties. These programs are not automatically offered. You generally have to call and ask specifically about restructuring or an internal debt relief program, even if you are not yet in default. This is worth doing before a debt reaches the collections stage, not after, since lenders are typically more willing to work with an account that is still current or only recently late.",
          "The jail threat works because it is designed to make you act from panic instead of from a plan: borrowing from a new app to cover an old one, agreeing to repayment terms you cannot actually sustain, or avoiding the problem entirely because looking at the full picture feels unsafe. None of that is necessary once the actual legal exposure is clear. A civil debt you cannot currently pay is a math and negotiation problem, not a liberty problem.",
          "That is also the entire premise behind Goodbye Debt's \"no judgment\" framing, and the Debt Slayers community built into the app: the people in it are managing exactly this kind of debt, in the open, without the fear tactics working on them anymore. Seeing your actual numbers, your real payoff order, and your real debt-free date is the calm version of a problem that collectors want to feel urgent and frightening."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      }
    ],
    "faq": [
      {
        "q": "Can a bank or lending app have me arrested for an unpaid balance?",
        "a": "No, not for the balance alone. Arrest requires an actual criminal case, such as BP 22 for a bounced check or proven estafa, with a court-issued warrant based on probable cause. An unpaid credit card, personal loan, or app loan by itself is a civil matter."
      },
      {
        "q": "What if I used a credit card knowing I might not be able to pay it back?",
        "a": "Ordinary financial difficulty is not the same as fraud. Estafa and RA 8484 both require deceit or fraudulent intent that existed when you got the credit, such as fake documents or a stolen card, not a later inability to pay that you did not intend from the start."
      },
      {
        "q": "Does filing for insolvency under Philippine law erase a BP 22 or estafa case?",
        "a": "No. The Financial Rehabilitation and Insolvency Act (FRIA) can suspend certain civil collection actions during a formal insolvency proceeding, but it does not erase or suspend criminal liability under BP 22 or estafa."
      },
      {
        "q": "Can online lending apps legally contact my family or employer about my debt?",
        "a": "No. Contacting people other than the borrower to pressure repayment, sometimes called contact blasting, is banned under the Data Privacy Act and specific SEC rules for lending companies, regardless of whether the underlying debt is real."
      },
      {
        "q": "If I am scared of a debt collector, what should I actually do first?",
        "a": "Confirm what you actually owe and to whom, in one place, so the picture stops feeling bigger than it is. Document any harassment separately. Then build an actual payoff order based on real interest rates, which replaces a vague fear with a specific, finishable plan."
      }
    ],
    "ctaLead": "See your own payoff order, free",
    "ctaSub": "Add your real debts and see your avalanche-ordered plan, your projected debt-free date, and the interest you would save. No bank linking, manual entry or a CSV, and nothing to pay before you see the numbers."
  },
  {
    "slug": "ipon-challenge",
    "title": "Ipon Challenge Philippines: Which Savings Challenge Actually Works (and What to Do If You Also Have Debt)",
    "description": "Every ipon challenge variant compared honestly, where each one fails, and why challenge money belongs in the payoff plan.",
    "kicker": "Savings challenges plus the debt question",
    "tldr": "Savings challenges work because they convert a vague goal into a specific, weekly, countable action, and the flat-amount weekly variant is the most sustainable. If you also carry debt, challenge money aimed at a 2 to 15 percent a month loan balance does more good than the same money parked in savings, so the challenge and the payoff plan need to be the same plan.",
    "sections": [
      {
        "heading": "Why savings challenges work when ordinary saving fails",
        "paragraphs": [
          "The mechanics are simple and worth stating, because they explain what to copy if you design your own. An ordinary goal (\"save more this year\") is open ended, has no deadline, and no visible progress, which is why it usually dies by February. A savings challenge replaces it with three things: a fixed amount, a fixed schedule, and a visible running count. Each week's deposit is a completed action, not a good intention, and the progress is countable, which is the same psychological mechanism that makes clearing an entire debt feel so different from watching a balance drop slowly.",
          "That mechanism, countable visible progress, is worth more than the specific amounts in any particular challenge. It is also the same reason the snowball payoff order works for people who have quit avalanche before: completed actions beat abstract progress."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The main variants, honestly compared",
        "paragraphs": [
          "The 52-week challenge. Save a set amount in week 1, increase it by a fixed step every week, and finish with a larger amount 52 weeks later. The classic version starts at 50 pesos and steps up 50 pesos a week, ending at 2,600 pesos in week 52 for a total of 68,900 pesos. The honest weakness: the back half of the year carries the heavy deposits, right when holiday spending peaks in the Philippines, and a missed week or two in the heavy zone is where most attempts die. The common fix is to run it in reverse (heaviest deposits first, while motivation is fresh) or to shuffle the order and cross off whichever weekly amount fits that week's budget. The printable tracker in the download above lays the whole 52 weeks out on one page, with a box to tick each week, a flat-weekly version for your own amount, and space to write your missed-week rule before you need it, so the shuffling does not have to happen in your head.",
          "The flat-amount weekly challenge. Pick one amount you can genuinely sustain, say 500 pesos a week, and deposit it every single week without variation. A year of that is 26,000 pesos. The honest strength: it is the most survivable variant, because the amount never grows past what your budget already proved it can carry. The honest weakness: it builds less than the stepped versions, and it produces no escalating sense of momentum.",
          "The fixed-target challenges (10k, 20k, 50k). Pick a target and a deadline, then work backward to a weekly or biweekly amount: 10,000 pesos in 25 weeks is 400 pesos a week; 20,000 in a year is about 385. These are the most motivating variants because the target is a concrete number, and they fail for the same reason ordinary saving fails if the derived weekly amount was never realistic for the actual budget.",
          "The no-spend challenge. A week or a month with a defined list of banned spending categories, where the money not spent gets counted and moved to savings on every defined day. As a permanent habit it is not sustainable, but as a one-month jolt that funds the first deposit of a real plan, it works, because it finds money that already exists in the budget rather than requiring new money.",
          "(All peso figures in this section are illustrative math on the stated rules, not a promised result; the amounts depend entirely on the weekly step and the starting amount you actually choose.)"
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null,
        "table": {
          "headers": [
            "Challenge",
            "How it works",
            "Where it fails",
            "Best for"
          ],
          "rows": [
            [
              "52-week stepped",
              "Start small, step up weekly; the classic 50 peso step totals 68,900 pesos",
              "Heavy deposits land on the holiday months",
              "Building the most, with discipline"
            ],
            [
              "Flat weekly",
              "One sustainable amount, every week, no variation",
              "Builds less than the stepped versions",
              "First-timers and irregular income"
            ],
            [
              "Fixed target",
              "Work backward from a target and deadline",
              "Fails if the derived weekly amount was never realistic",
              "Concrete-goal savers"
            ],
            [
              "No-spend month",
              "Ban spending categories, bank the difference",
              "Not sustainable as a permanent habit",
              "Funding the first deposit of a real plan"
            ]
          ]
        }
      },
      {
        "heading": "Where the challenges fail, and how to survive the failure point",
        "paragraphs": [
          "Every variant above has the same failure point, and it is worth naming precisely because it is predictable: the week where the deposit amount exceeds what that week's budget genuinely has spare. For the stepped 52-week challenge this lands in the back half of the year, right at the Philippine holiday season, which is why so many attempts that survive cleanly through September die in November and December. For fixed-target challenges it lands wherever the derived weekly amount turns out to be too aggressive, commonly within the first quarter. For no-spend challenges it lands the first week, because banning categories cold without replacing them is harder than it looks.",
          "The survival fix is the same for all three: set the challenge amount from the bottom up (what the budget genuinely spares weekly) instead of the top down (what the challenge's rules demand), and pre-plan the failure response. A plan with a pre-decided rule for a missed week (make it up partially next week, never abandon the count) survives setbacks that kill a plan with no rule, because the setback was expected and the response was already decided. This is the same structure that makes a debt payoff plan survive a bad month: the plan that accounts for failure outlives the plan that assumes none."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The part most ipon challenge content leaves out: what the money is for",
        "paragraphs": [
          "Here is the honest question almost none of this content asks: what happens to the 68,900 pesos at the end of the 52 weeks? A challenge with no destination is a parking lot, and the money parked there has a real opportunity cost if you also carry debt. A balance on a Tala loan, a GCredit draw, a BillEase installment, or a credit card costs 2 to 15 percent a month, every month. Savings parked next to that debt earns a small fraction of that in interest. Every month the challenge money sits in a savings wallet while a high-rate balance sits too, the spread between those two rates is real money lost, not saved.",
          "This is not an argument against saving. An emergency buffer is a genuine need, and a plan that leaves zero room for an emergency tends to fail the first time a real one arrives. The honest structure: a small starter buffer first, enough to absorb one unexpected expense, then challenge money and payoff money become the same money, directed at the highest-rate balance instead of a savings wallet."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "What to do differently if you have debt and want to run a challenge anyway",
        "paragraphs": [
          "The workable version looks like this:",
          "Run that way, a 500-peso weekly challenge is not a savings hobby, it is 2,000 pesos a month of extra payment on the most expensive balance you carry, which on a 100,000 peso debt at a 2 percent a month blended rate shortens a decade-long minimum-payment timeline by years and saves tens of thousands of pesos in interest. The challenge supplies the weekly action and the visible count; the payoff plan supplies the destination and the math. Each supplies exactly what the other is missing, which is why this combination works better than either alone."
        ],
        "bullets": null,
        "numbered": [
          "Build the actual payoff plan first: every debt listed with its real balance and real rate, in one place, ranked in avalanche order. This is the destination the challenge money is working toward.",
          "Set the challenge amount to whatever the budget genuinely sustains weekly, using the flat-amount variant if honest budgeting says the stepped versions are too aggressive in their back half.",
          "Direct each week's deposit at the top of the payoff order, the highest-rate balance, not a savings wallet, once a small starter buffer exists.",
          "Track both in the same weekly five-minute check: the challenge count and the payoff progress are the same progress, viewed two ways."
        ],
        "subheadings": null
      },
      {
        "heading": "See the destination your challenge money is working toward",
        "paragraphs": [
          "Enter your real debts alongside the weekly amount you plan to deposit, and Goodbye Debt's free plan shows your avalanche-ordered priority, your projected debt-free date, and the real interest difference the weekly deposit makes, so the challenge and the plan are one view instead of two guesses. No bank linking, manual entry or a CSV, and nothing to pay before you see the numbers."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      }
    ],
    "faq": [
      {
        "q": "Which ipon challenge is most realistic for a first-timer?",
        "a": "The flat-amount weekly variant, set to an amount one normal week of your actual budget already proved sustainable, is the most survivable. The stepped 52-week version builds more but concentrates its heavy deposits in the holiday months, where most attempts fail, unless you run it in reverse or shuffle the weekly amounts."
      },
      {
        "q": "Should I save in an ipon challenge or pay off debt first?",
        "a": "Both, in a specific order: a small starter buffer first, then every extra peso, including challenge deposits, directed at the highest-rate balance. Challenge money parked in savings next to a loan balance costing 2 to 15 percent a month loses the spread between those rates every month it sits."
      },
      {
        "q": "How much does the 52-week challenge actually total?",
        "a": "Depends entirely on the step you choose: the classic 50-peso step starting at 50 pesos totals 68,900 pesos over 52 weeks. Halve the step and the total halves; the math is fully under your control, which is exactly why checking it against your real budget before starting matters more than copying any published version."
      },
      {
        "q": "Can I run an ipon challenge with an irregular income?",
        "a": "Yes, with the flat-amount variant set at your lowest reliably expected weekly amount, treating any higher week as a bonus deposit toward the priority balance rather than the baseline you are counting on."
      },
      {
        "q": "Where should ipon challenge money be kept?",
        "a": "Somewhere separate from spending money, visible, and cheap to move out of: a separate e-wallet or savings account you do not carry a card for. The separation is what protects the count; the cheap-to-move part matters because, once the starter buffer exists, the money's real job is paying down the highest-rate balance, not accumulating."
      }
    ],
    "ctaLead": "See your own payoff order, free",
    "ctaSub": "Add your real debts and see your avalanche-ordered plan, your projected debt-free date, and the interest you would save. No bank linking, manual entry or a CSV, and nothing to pay before you see the numbers.",
    "resource": {
      "label": "Free printable",
      "blurb": "The 52-week tracker on one printable page: every week's amount, a box to tick, a blank version for your own weekly figure, and a space to write your missed-week rule before you need it.",
      "href": "/guides/ipon-challenge-chart.pdf",
      "cta": "Download the tracker (PDF)"
    }
  },
  {
    "slug": "pag-ibig-home-loan-requirements",
    "title": "Pag-IBIG Home Loan Requirements: The Full Checklist",
    "description": "Who qualifies, how much you can actually borrow, the full document checklist, and where the Pag-IBIG loan belongs in your payoff priority.",
    "kicker": "Requirements, rates, documents",
    "tldr": "You need at least 24 monthly Pag-IBIG contributions, to be under 65 at application, proof of income matched to your employment type, and property documents for the home itself. Rates run roughly 3 to 9.75 percent depending on your repricing term, and your actual loanable amount depends on your income and the property's appraisal, not the published ceiling alone.",
    "sections": [
      {
        "heading": "Who qualifies, before anything else",
        "paragraphs": [
          "Four conditions apply across every source on this program, consistently:",
          "OFWs qualify on the same contribution basis and can appoint someone else to process the application through a Special Power of Attorney authenticated by the Philippine consulate."
        ],
        "bullets": [
          "You are an active Pag-IBIG Fund member with at least 24 monthly contributions. These do not need to be consecutive, and if you are short, you can pay the gap as a lump sum to reach 24.",
          "You made at least one contribution within the 6 months before you apply.",
          "You are not over 65 at the time of application, and the loan must mature before you turn 70. A 45 year old applicant, for example, tops out at a 25 year term.",
          "You have no existing Pag-IBIG housing loan that was foreclosed, cancelled, bought back, or voluntarily surrendered, and no other Pag-IBIG loan currently in default. Pag-IBIG also requires that you have no short-term loan (multi-purpose loan) in arrears at the time of application, and that any existing housing loan where you are a borrower or co-borrower is current."
        ],
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "How much you can actually borrow",
        "paragraphs": [
          "The published ceiling is 10,000,000 pesos per member, raised from the long-standing 6,000,000 peso limit under the 2026 program update tied to the government's Expanded Pambansang Pabahay para sa Pilipino (4PH) Program, and documented in Pag-IBIG Fund Circular No. 491. You can also add up to two co-borrowers, whose incomes combine with yours when Pag-IBIG computes capacity to pay. Treat the circulars Pag-IBIG publishes at the time you apply as the binding figures, not any single article, including this one, because program ceilings and promotional terms do change.",
          "Separately from the ceiling, your actual approved amount is the lowest of four things:",
          "On capacity to pay, the standard rule Pag-IBIG applies is that your monthly amortization should not exceed 35 percent of your gross monthly income, the figure used in Pag-IBIG's own borrower orientation materials and loanable-amount tables. Some program variants and secondary calculators apply a lower band on larger loans, and the number Pag-IBIG's evaluators compute for your specific application is the one that binds. Plan around 35 percent until your Notice of Approval confirms what was applied to your case.",
          "Pag-IBIG sends its own appraiser, and that appraised value is commonly lower than the price you agreed to pay the seller or developer. The gap between the loan Pag-IBIG approves and the price you owe the seller is cash you need to cover yourself, on top of transfer taxes and fees."
        ],
        "bullets": null,
        "numbered": [
          "Your actual need: the purchase price, construction cost, or the outstanding balance you are refinancing.",
          "The amount you ask for.",
          "Your loanable amount based on capacity to pay, meaning your monthly amortization has to fit within the share of your gross monthly income that Pag-IBIG allows (the standard rule is below).",
          "The loan-to-appraised-value ratio: a percentage of the property's appraised value (not the selling price), commonly near 95 percent for lower-priced properties and lower above that, and lower still for a lot purchased without a house."
        ],
        "subheadings": null
      },
      {
        "heading": "Interest rates, and why the number you see online often is not your number",
        "paragraphs": [
          "Pag-IBIG prices its housing loan by repricing period: the shorter the period you lock in, the lower your starting rate, but the rate can move at the end of that period. The published schedule, valid for applications until December 31, 2026 under the Expanded 4PH promotional rates:",
          "The promotional 4.5 and 5.75 percent rates hold for the first three years and apply to applications received until December 31, 2026; after the fixed period the loan reprices at the schedule for the repricing period you chose. The 3 percent socialized rate is a subsidized, slot-capped program with income qualifications, so do not assume you qualify until Pag-IBIG confirms it."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null,
        "table": {
          "headers": [
            "Rate option",
            "Interest rate",
            "Applies to"
          ],
          "rows": [
            [
              "Socialized (subsidized)",
              "3 percent",
              "Eligible socialized housing borrowers: house and lot priced up to 950,000 pesos, or a qualifying condo up to 1.8 million pesos"
            ],
            [
              "Promotional, first 3 years fixed",
              "4.5 percent",
              "Loans above the socialized price ceilings, up to 4.9 million pesos"
            ],
            [
              "Promotional, first 3 years fixed",
              "5.75 percent",
              "Loans above 4.9 million pesos, up to the 10 million peso ceiling"
            ],
            [
              "Regular, 3-year repricing",
              "6.25 percent",
              "Any loan, chosen instead of the promo"
            ],
            [
              "Regular, 5-year repricing",
              "6.5 percent",
              "Any loan"
            ],
            [
              "Regular, 10-year repricing",
              "7.125 percent",
              "Any loan"
            ],
            [
              "Regular, 15-year repricing",
              "7.75 percent",
              "Any loan"
            ],
            [
              "Regular, 20-year repricing",
              "8.5 percent",
              "Any loan"
            ],
            [
              "Regular, 25-year repricing",
              "9.125 percent",
              "Any loan"
            ],
            [
              "Regular, 30-year repricing",
              "9.75 percent",
              "Any loan"
            ]
          ]
        }
      },
      {
        "heading": "Documents you need, organized by the thing that actually changes: your income proof",
        "paragraphs": [
          "Every applicant needs the Pag-IBIG Housing Loan Application Form, a valid government ID, a PSA-issued birth certificate, and a PSA-issued marriage certificate if applicable. Where the paperwork actually differs is proof of income:",
          "For the property itself: a certified true copy of the Transfer Certificate of Title or Condominium Certificate of Title, a lot plan with vicinity map certified by a licensed geodetic engineer, a tax declaration, the latest real property tax receipt, and either a Contract to Sell or Deed of Absolute Sale for a purchase, or building plans and a bill of materials if you are financing construction instead."
        ],
        "bullets": [
          "Locally employed: Certificate of Employment showing compensation, plus your latest payslips (commonly 1 to 3 months).",
          "Self-employed: Income Tax Return, business registration documents, and financial statements.",
          "OFW: employment contract, proof of remittance, POEA or OWWA documents, and the Special Power of Attorney if someone else is filing on your behalf."
        ],
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "How to apply, step by step",
        "paragraphs": [],
        "bullets": null,
        "numbered": [
          "Confirm your contribution count through the Virtual Pag-IBIG portal. If you are short of 24, pay the difference as a lump sum.",
          "Submit a pre-qualification application, online or at a branch, to get an estimate of what you can borrow based on your income.",
          "Submit the full application with every document above for your employment type.",
          "Wait for the preliminary assessment, commonly 3 to 5 business days for the initial review, longer for the full loan process.",
          "Receive your Notice of Approval, which states your actual approved amount, rate, term, and any remaining conditions before release."
        ],
        "subheadings": null
      },
      {
        "heading": "A worked example of the actual monthly payment",
        "paragraphs": [
          "Numbers make this concrete. A 1,800,000 peso loan at the 4.5 percent promotional rate, fixed for 3 years, over a 20 year term, runs an estimated monthly amortization around 11,400 pesos, before mortgage redemption insurance and the other loan charges. The same loan at the standard 6.25 percent three-year repricing rate runs around 13,200 pesos a month. That difference, roughly 1,800 pesos every month during the promotional period, is exactly why confirming which rate bracket actually applies to your loan amount and chosen repricing period matters more than the headline number on any single page you read, including this one."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "What happens if you miss a payment",
        "paragraphs": [
          "Pag-IBIG housing loans are not exempt from penalties. A missed amortization adds a late payment charge, and repeated missed payments put the loan at risk of default, which can affect your eligibility for any future Pag-IBIG loan, not just future housing loans. If you know a payment will be difficult, contacting Pag-IBIG before missing it, to ask about restructuring, is a meaningfully better position than missing it and dealing with the penalty and default risk afterward. This mirrors how bank personal loans and credit cards work: the lender almost always has more flexibility to offer before a default than after one."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Already have a Pag-IBIG loan, plus other debt",
        "paragraphs": [
          "A Pag-IBIG housing loan is one of the cheapest, most stable debts a Filipino household can carry, which is exactly why it is usually the wrong place to send extra money if you are also holding a credit card, an app loan, or a BillEase or Cashalo balance at several times the rate. The housing loan's low, long-term rate means it should typically sit at the bottom of your payoff priority, paid on schedule, while anything else you owe at a higher monthly rate gets the extra peso. If you are juggling a Pag-IBIG loan alongside other debts and are not sure which one is actually costing you the most right now, that is a two minute check with real numbers, not a guess based on which bill feels heaviest."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      }
    ],
    "faq": [
      {
        "q": "Can I have a Pag-IBIG housing loan and a Pag-IBIG Multi-Purpose Loan at the same time?",
        "a": "Generally yes, the restriction that disqualifies you applies to an existing or defaulted housing loan specifically, not to other Pag-IBIG loan types, though both still count against your overall capacity-to-pay assessment."
      },
      {
        "q": "What happens if the appraised value is lower than what I agreed to pay?",
        "a": "Your loan is based on the lower appraised value, not the selling price you negotiated. You cover the difference, plus transfer taxes and fees, out of pocket as your cash equity."
      },
      {
        "q": "Is the lowest advertised rate the rate I will actually get?",
        "a": "Usually not. The lowest published rates belong to limited, slot-capped socialized or promotional programs with income ceilings and application windows (the current one runs until December 31, 2026). Most standard borrowers land on the regular repricing schedule, 6.25 percent on a 3-year fixing up to 6.5 percent on a 5-year fixing, unless their loan amount and eligibility put them in the promotional or socialized brackets."
      },
      {
        "q": "Should I pay off other debts before applying for a Pag-IBIG housing loan?",
        "a": "Depends on the debt. A high-rate app loan or credit card balance can hurt your approved capacity-to-pay figure and is worth addressing first if possible. A low-rate, current loan like an SSS salary loan is less likely to be the deciding factor."
      },
      {
        "q": "Is it better to pay extra toward my Pag-IBIG housing loan or toward a credit card I also carry?",
        "a": "In almost every real case, the credit card, at a rate several times higher than the housing loan, should get the extra payment first. The housing loan's low fixed rate is the reason it belongs at the bottom of the list, not the top."
      }
    ],
    "ctaLead": "See your own payoff order, free",
    "ctaSub": "Add your real debts and see your avalanche-ordered plan, your projected debt-free date, and the interest you would save. No bank linking, manual entry or a CSV, and nothing to pay before you see the numbers."
  },
  {
    "slug": "billease-interest-rate",
    "title": "BillEase Loan: Interest Rate, Requirements, and How It Compares",
    "description": "What BillEase costs, the zero percent catch, and where it sits against cards, app loans, and government loans.",
    "kicker": "3.49 percent a month",
    "tldr": "BillEase charges 3.49 percent a month on its standard cash loan and buy-now-pay-later plans, with a 0 percent option at select partner merchants. That puts it in the middle of the Philippine BNPL field: cheaper than GCash GCredit or Tala, more expensive than a bank loan or a government salary loan.",
    "sections": [
      {
        "heading": "What BillEase actually offers",
        "paragraphs": [
          "BillEase runs two connected products. The buy-now-pay-later option lets you shop at partner merchants and split the cost into installments, commonly with a down payment covering part of the item's price, the rest spread over your chosen term. The cash loan converts your approved credit limit into money sent to your bank account or e-wallet directly, usable for anything.",
          "Both run on the same core rate: 3.49 percent a month, charged on the declining balance for most plans. BillEase also offers an EasyPace option with a longer term, up to 24 months, at 4.16 percent a month recalculated on your declining principal, which trades a slightly higher rate for more time to repay and lower individual installments."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The requirements",
        "paragraphs": [
          "To apply, you need to be at least 18 years old with a stable source of income. Documents commonly requested:",
          "Signing up happens entirely in the app: enter your phone number and email, scan a valid ID, and your credit limit activates once approved, commonly within minutes. First-time limits have historically started in the 30,000 peso range, growing as you repay on time; BillEase's own current marketing describes limits up to 50,000 pesos, so treat the exact starting figure as something that moves and confirm it in your own app at signup rather than a fixed number."
        ],
        "bullets": [
          "A valid government-issued ID",
          "Proof of income (payslips, a Certificate of Employment, or BIR Form 2316 for employed applicants)",
          "Proof of billing"
        ],
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Where the 3.49 percent rate actually sits",
        "paragraphs": [
          "Rate comparisons only mean something next to what else is out there. Commonly cited monthly rates on similar Filipino lending products:",
          "(These are commonly published ranges, not a guarantee of your specific rate. Every lender's actual terms depend on your application, and rates move. Check your own loan agreement.)",
          "Read that list honestly: BillEase is not the cheapest way to borrow in the Philippines, but it is also not the most expensive. A government salary loan or a bank personal loan both beat it clearly on rate. An app loan like Tala or GCredit typically costs more than BillEase for the same amount borrowed the same length of time."
        ],
        "bullets": [
          "SSS salary loan or Pag-IBIG Multi-Purpose Loan: under 1 percent a month",
          "Bank personal loan: roughly 1.2 to 1.5 percent a month",
          "Home Credit cash loan: commonly cited around 2.8 percent a month",
          "Credit card: capped by the BSP at 3 percent a month",
          "BillEase: 3.49 percent a month (standard), 4.16 percent on EasyPace",
          "Cashalo: a combined daily interest and service fee structure that, in a published worked example, worked out to roughly 15 percent of the principal over a 90 day term, higher in effective monthly terms than the headline rate suggests",
          "GCash GCredit: 4.15 percent a month, published",
          "Tala: 11 to 12 percent a month effective, per its own disclosure"
        ],
        "numbered": null,
        "subheadings": null,
        "table": {
          "headers": [
            "Lender product",
            "Monthly rate",
            "Notes"
          ],
          "rows": [
            [
              "SSS or Pag-IBIG salary loan",
              "Under 1 percent",
              "The cheapest money in the list"
            ],
            [
              "Bank personal loan",
              "About 1.2 to 1.5 percent",
              "Requires an application and a credit check"
            ],
            [
              "Credit card",
              "Up to 3 percent a month (BSP cap)",
              "Cheaper than BillEase if you revolve a balance"
            ],
            [
              "Home Credit cash loan",
              "About 2.8 percent effective",
              "Varies by product and term"
            ],
            [
              "BillEase",
              "3.49 percent (4.16 on EasyPace)",
              "Published, consistent, one number"
            ],
            [
              "GCredit",
              "4.15 percent, published",
              "Pricier than BillEase"
            ],
            [
              "Cashalo",
              "Daily rates, up to about 15 percent effective",
              "Highest of the group in the published example"
            ],
            [
              "Tala",
              "11 to 12 percent effective, own disclosure",
              "Priciest mainstream app loan"
            ]
          ]
        }
      },
      {
        "heading": "The zero percent option, and what it actually requires",
        "paragraphs": [
          "BillEase's 0 percent interest offer applies at select partner merchants, generally tied to a specific repayment term (the \"Pay with Grace\" structure runs interest free for a 3 or 6 month grace period). If the balance is not cleared in full within that window, the standard 3.49 percent monthly rate applies retroactively from the first installment. Read that condition before counting on the 0 percent headline: it is a real offer, but it is conditional, not a flat discount regardless of how you pay."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "A worked example across the actual plans",
        "paragraphs": [
          "Borrowing 20,000 pesos over 3 months makes the comparison concrete. On the standard 3.49 percent monthly plan, declining balance, total interest over 3 months runs roughly 1,200 to 1,400 pesos, for a total repayment near 21,300 to 21,400 pesos. On EasyPace at 4.16 percent over a longer 12 month term instead, the per-installment amount drops substantially since the same principal is spread across four times the payments, but total interest paid over the full term is higher in absolute pesos, the standard trade-off of a longer term at a higher rate: smaller bites, more of them, more total interest. At a 0 percent partner merchant offer with full repayment inside the grace period, total repayment equals the 20,000 principal exactly, provided every payment lands inside the grace window; miss that window and the standard 3.49 percent rate applies retroactively from the first installment, which can erase the advantage entirely.",
          "The practical takeaway: the 0 percent offer is genuinely the cheapest option, but only for someone confident they can clear the balance inside the grace period. For anyone likely to need more time, the standard plan's flat, predictable rate is easier to budget around than a 0 percent offer that reverts to a worse rate than the standard plan if the deadline slips."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Applying step by step",
        "paragraphs": [],
        "bullets": null,
        "numbered": [
          "Download the BillEase app and sign up with your phone number and email, which takes about two minutes.",
          "Scan a valid government ID; the app reads your details automatically and asks you to confirm them.",
          "Submit proof of income if requested (payslips, a Certificate of Employment, or BIR Form 2316 for employed applicants).",
          "Receive your approved limit, commonly within minutes once verification clears.",
          "Use the limit at a partner merchant checkout for BNPL, or request a cash loan disbursed to your bank account or e-wallet directly."
        ],
        "subheadings": null
      },
      {
        "heading": "If BillEase is one of several things you owe",
        "paragraphs": [
          "The comparison that actually matters is not \"is BillEase a fair lender,\" it clearly is a licensed, mainstream option, but \"where does a 3.49 percent monthly balance rank against everything else I currently owe.\" If you also carry a Tala loan at 11 to 12 percent a month effective and an SSS salary loan at under 1 percent, the honest priority order sends extra payment to Tala first, keeps BillEase on its normal schedule in the middle, and lets the SSS loan ride at minimum payments since it is already the cheapest money you have. Most people juggling three or four of these accounts are guessing at that order from memory, usually prioritizing whichever bill feels most urgent that week rather than whichever one is actually costing the most."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "What happens if you miss a BillEase payment",
        "paragraphs": [
          "A missed installment adds a late fee, commonly a fixed peso charge or a percentage of the unpaid amount depending on your plan, and repeated missed payments can suspend your BillEase limit and affect your standing for future offers. BillEase reports to credit bureaus, so a delinquent BillEase account can also affect how other lenders evaluate your applications, the same way a delinquent credit card would. If you know an installment will be hard to cover, contacting BillEase before missing it is a meaningfully better position than missing it first; like most lenders, it has more flexibility to offer before an account goes delinquent than after one."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "BillEase for everyday spending versus a credit card",
        "paragraphs": [
          "A common use of BillEase is not borrowing a lump sum at all, it is splitting purchases at partner merchants into installments instead of putting them on a card. Compared at the same balance: a credit card is capped at 3 percent a month on an unpaid revolving balance, below BillEase's 3.49 percent, so revolving a balance still costs more on BillEase than on a card, though at the cap the gap is under half a point a month. The counterweight: BillEase's installment plans have a fixed end date, and a card balance can sit for years if you pay minimums, which is the trap covered elsewhere in this series. The honest comparison for a one-off purchase you will clear inside a few months: the card's 3 percent monthly cap is cheaper if you actually clear it, and a 0 percent BillEase partner offer beats both if the balance is genuinely cleared inside the grace window. For someone carrying balances long term, neither product is cheap, which is the point of ranking everything you owe by its real rate instead of by which product feels more official."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "See where BillEase actually ranks in your own plan",
        "paragraphs": [
          "Enter your BillEase balance alongside anything else you owe, and Goodbye Debt's free plan shows you the avalanche-ordered priority across all of it, your projected debt-free date, and the real interest difference between paying in that order versus guessing. No bank linking, manual entry or a CSV, and nothing to pay before you see the numbers."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      }
    ],
    "faq": [
      {
        "q": "Is BillEase's interest rate fixed for the life of the loan?",
        "a": "The standard 3.49 percent monthly rate applies to the plan you choose at signup. EasyPace runs at a different rate, 4.16 percent, recalculated on your declining balance, so your chosen plan determines which rate structure applies for that loan's full term."
      },
      {
        "q": "Does BillEase require a credit card to apply?",
        "a": "No. BillEase explicitly markets itself as not requiring a credit card, approving based on a valid ID and income information submitted in the app."
      },
      {
        "q": "How is BillEase's rate different from Cashalo's or Tala's?",
        "a": "BillEase quotes a single, consistent monthly rate. Some competitors combine a lower-sounding headline rate with a separate daily service fee, which can add up to a higher effective cost than the headline number implies. Comparing the total amount you would repay, not just the advertised rate, is the only reliable way to compare across lenders."
      },
      {
        "q": "Can I pay off a BillEase loan early without a penalty?",
        "a": "BillEase's own terms describe overpayments as applied toward your principal, which generally reduces your total interest when you pay ahead. Confirm your specific plan's early repayment terms in your loan agreement before assuming this applies uniformly."
      },
      {
        "q": "If I have a BillEase balance and a credit card, which should I pay off first?",
        "a": "Compare the two rates directly. A standard Philippine credit card is capped at 3 percent a month by the BSP, just under BillEase's 3.49 percent, so the BillEase balance is still the more expensive one to clear first, though at the cap the gap is narrow, about half a point a month."
      }
    ],
    "ctaLead": "See your own payoff order, free",
    "ctaSub": "Add your real debts and see your avalanche-ordered plan, your projected debt-free date, and the interest you would save. No bank linking, manual entry or a CSV, and nothing to pay before you see the numbers."
  },
  {
    "slug": "how-to-become-debt-free",
    "title": "How to Become Debt-Free in the Philippines: A Realistic Timeline",
    "description": "What actually moves your debt-free date, month by month, and why the extra peso matters more than the method.",
    "kicker": "18 to 36 months",
    "tldr": "Most Filipinos carrying a mix of credit card, app loan, and government debt can realistically be debt-free in 18 to 36 months with a consistent payoff order and steady extra payments. The timeline depends far more on how much extra you can pay each month than on which method you pick, and seeing your actual date beats guessing at one.",
    "sections": [
      {
        "heading": "Why \"how long will this take\" rarely gets a straight answer",
        "paragraphs": [
          "Search this question and most articles give you a range (18 to 36 months is a genuinely common one, cited by several Philippine personal finance sources) without explaining why the range is so wide. The honest answer: your timeline depends on three things, in order of how much they actually matter.",
          "Most generic timelines you will find online average across all three factors and hand you a single number. That number is not wrong, but it is not your number either."
        ],
        "bullets": null,
        "numbered": [
          "How much extra you can put toward debt each month, above your minimums. This single number moves your date more than anything else.",
          "How your current debt is split between high-rate and low-rate balances. A mix that is mostly a cheap SSS or Pag-IBIG loan clears faster than the same total balance sitting mostly in app loans or credit cards.",
          "Which method you use, snowball or avalanche. This affects total interest paid more than it affects your exact debt-free month, for most realistic debt combinations."
        ],
        "subheadings": null
      },
      {
        "heading": "What actually changes your date the most",
        "paragraphs": [
          "Take two people with the identical 200,000 pesos in debt, same interest rates. One has 5,000 pesos a month available above minimums. The other has 10,000. Doubling the extra payment roughly halves the time to debt-free, not exactly, since the math compounds, but close enough that the direction is unmistakable. This is why the single most useful thing you can do before worrying about method or motivation is find a genuinely honest number for how much you can actually send to debt each month, including money found by cutting one or two real, specific expenses rather than a vague \"I'll try to save more.\"",
          "A smaller, often overlooked lever: your interest rate mix. If your 200,000 pesos is mostly a 5 percent a month app loan, you are losing roughly 10,000 pesos a month to interest alone before any principal moves. If the same balance is mostly an under 1 percent SSS loan, interest is eating closer to 2,000 pesos a month. The gap between those two numbers is the entire reason paying the highest rate down first (avalanche) accelerates your real debt-free date beyond what extra payment alone would do."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "A realistic month-by-month shape, not a fantasy one",
        "paragraphs": [
          "Here is what an honest 24 month plan tends to look like, not the version that assumes nothing ever goes wrong:",
          "A genuine setback, a reduced income month, an emergency expense, a missed payment, pushes this out, and a realistic plan accounts for that rather than pretending it will not happen. The honest answer to \"what if something goes wrong\" is: the date moves, the order usually does not need to change, and a plan that survives one bad month is more valuable than a plan that only works if nothing ever does."
        ],
        "bullets": [
          "Months 1 to 3: get every debt listed in one place with real balances and rates, confirm minimums are all current, and direct every extra peso at the highest-rate balance. This phase is mostly setup, and progress can feel slow because the biggest balance has not moved much yet.",
          "Months 4 to 10: the highest-rate debt, often an app loan or a BNPL balance, clears if it was moderate sized, or drops sharply if it was large. This is usually where the plan starts to feel real, because a full account disappearing is a visible, countable win.",
          "Months 11 to 18: the freed-up payment from the cleared debt rolls into the next highest rate, commonly a credit card. Progress compounds here: each payment is larger than the last because it carries the weight of everything already paid off.",
          "Months 19 to 24 and beyond: remaining low-rate debt, often a government loan, clears last, frequently on close to its original minimum schedule since it was never the priority target."
        ],
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "How much extra a month is actually realistic",
        "paragraphs": [
          "Because extra payment moves the date more than anything else, the honest number for it deserves more than a guess. A common framework in Philippine personal finance content is the 50/30/20 split of net income: roughly half to needs, roughly a third to wants, roughly a fifth to savings and debt. Applied to a take-home pay of 30,000 pesos a month, that frame puts around 6,000 pesos a month toward savings and debt combined. Real Filipino median household incomes sit lower, and 50/30/20 is a framework, not a rule with any enforcement behind it, so treat it as a starting structure to adjust against your actual expenses.",
          "The more reliable method is bottom-up: list what actually leaves your account every month, find one or two specific, cuttable expenses (a subscription, a weekly food delivery habit, a data plan tier you do not use), and price them honestly. Two cuts of 1,500 pesos each are a 3,000 peso a month extra payment, which on a 200,000 peso debt at a 2 percent a month blended rate moves a minimum-plus-minimum timeline of over a decade down to roughly five and a half years, and on a plan already attacking the highest-rate balance first, shaves months off an already faster date. Small cuts, applied consistently, beat a large aspirational number that never materializes, because the plan built on the large number stalls the first month it fails."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Why \"a realistic timeline\" beats motivational advice",
        "paragraphs": [
          "A lot of debt-free content leans on motivation: discipline, sacrifice, willpower. Those things matter, but they are not what actually tells you when you will be done. What tells you that is your real balances, your real rates, and your real extra payment amount, run through an actual payoff order. Motivational framing without that math leaves you with resolve and no finish line to resolve toward, which is part of why debt payoff attempts stall: the goal is open ended, and open ended goals are harder to sustain than ones with a visible date."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "How to track the plan without obsessing over it",
        "paragraphs": [
          "A payoff plan needs tracking, but the tracking frequency matters more than most people realize. Checking balances daily produces anxiety without producing information: daily balance movement is almost entirely interest accrual and noise, and it does not change any decision. The useful cadence is weekly: one look at every balance in one place, confirm every minimum due is scheduled or paid, confirm the extra payment went out, done. A monthly view is too slow to catch a missed payment before it becomes a penalty, and a daily view is too fast to feel like anything except dread. The weekly middle, five minutes, same day each week, is the cadence that most consistently survives a full payoff plan, which matters because a plan you stop looking at is a plan you stop following.",
          "This is also why the single-location requirement keeps coming up in this series: a weekly check only works if every balance is genuinely visible in one place. Spread across five apps, the weekly check becomes five logins, and five logins is enough friction that the habit dies within a month for most people."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "See your actual debt-free date",
        "paragraphs": [
          "This is the exact number Goodbye Debt's free plan calculates for you: add your real debts, and see your projected debt-free date based on your actual balances, rates, and however much extra you can realistically send each month, not a generic range pulled from an article. No bank linking, manual entry or a CSV, and the date updates the moment any of your numbers change."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      }
    ],
    "faq": [
      {
        "q": "Is 18 to 36 months a realistic range for most Filipino debt situations?",
        "a": "It is a commonly cited range for moderate debt loads with consistent extra payments, but your own number depends heavily on your total balance, your rate mix, and how much extra you can pay monthly. Treat any generic range, including this one, as a starting expectation to check against your real numbers, not a promise."
      },
      {
        "q": "Does switching between snowball and avalanche change my debt-free date significantly?",
        "a": "Usually less than people expect. The two methods mostly change how much total interest you pay and how the milestones feel along the way, not the final month by a wide margin, unless your rate spread between debts is unusually large."
      },
      {
        "q": "What if my income is irregular, can I still build a realistic timeline?",
        "a": "Yes, plan around your lowest reliably expected extra payment amount rather than your best month, and treat any month that comes in higher as a bonus payment toward your priority debt rather than the baseline you are counting on."
      },
      {
        "q": "Should I pause debt payoff to build an emergency fund first?",
        "a": "A small starter buffer, even a few thousand pesos, before aggressively attacking debt is a common and reasonable approach, since it prevents one unexpected expense from becoming a brand new loan. Beyond that small buffer, extra money is generally better used against high-rate debt than sitting in savings earning far less than that debt is costing you."
      },
      {
        "q": "What happens to my timeline if I miss a payment along the way?",
        "a": "A single missed payment typically adds a penalty and pushes your date out by roughly that same disruption, rather than derailing the whole plan. Getting back to the payoff order the following month matters more than the setback itself."
      }
    ],
    "ctaLead": "See your own payoff order, free",
    "ctaSub": "Add your real debts and see your avalanche-ordered plan, your projected debt-free date, and the interest you would save. No bank linking, manual entry or a CSV, and nothing to pay before you see the numbers."
  },
  {
    "slug": "cashalo-application",
    "title": "Cashalo Loan Application: Step-by-Step Guide",
    "description": "Documents, timeline, and why the headline daily rate understates the real cost of a CashaLoan.",
    "kicker": "Requirements plus real cost",
    "tldr": "Apply through the Cashalo app with one valid government ID, proof of income, and a bank or e-wallet account matching your registered mobile number. Approval commonly arrives within a day, with funds released up to 3 business days after that, and the real cost depends on reading the combined interest and service fee structure, not just the headline rate.",
    "sections": [
      {
        "heading": "What you need before you start",
        "paragraphs": [
          "Cashalo asks for the same core documents regardless of how you earn:"
        ],
        "bullets": [
          "One valid government-issued ID: UMID, SSS ID, driver's license, passport, or a PhilSys national ID.",
          "Proof of income. Employed applicants submit payslips, a Certificate of Employment, or BIR Form 2316. Self-employed applicants submit DTI or SEC registration, a business permit, bank statements, or BIR Form 1701.",
          "A bank account or e-wallet, such as GCash, registered under the same mobile number you use for your Cashalo account, since that is where approved funds are released."
        ],
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Applying step by step",
        "paragraphs": [],
        "bullets": null,
        "numbered": [
          "Download the Cashalo app and register using your mobile number.",
          "Complete your profile: full legal name, birth date, address, and employment details.",
          "Upload your valid ID and complete a facial verification selfie so the photo can be matched against the ID.",
          "Upload your proof of income document for your employment type.",
          "Choose your loan amount and term from what you are offered; first-time borrowers are typically offered a smaller amount and smaller limits that grow with on-time repayment history.",
          "Submit the application and wait for an SMS notification with the decision, commonly within a day.",
          "Once approved, funds are released to your linked bank account or e-wallet, typically within 3 business days, sometimes faster."
        ],
        "subheadings": null
      },
      {
        "heading": "The rate structure, and why the headline number can mislead you",
        "paragraphs": [
          "This is the part worth reading slowly, because it is also the clearest real-world lesson in why \"the advertised rate\" and \"what you actually pay\" are not always the same number. Cashalo's cost is commonly split into two separate charges: a daily interest rate and a separate daily service fee, both calculated on your outstanding balance, rather than one single combined monthly rate the way a bank or BillEase prices a loan.",
          "A published worked example makes this concrete: a 2,000 peso loan over a 90 day term, charged roughly 0.2 percent interest a day plus roughly 0.3 percent service fee a day, works out to somewhere in the neighborhood of 900 pesos in combined interest and fees over the full term, on top of the original 2,000 pesos borrowed. That is a real cost of roughly 45 percent of the principal over three months, which annualizes to a far higher effective rate than a single quoted \"monthly\" or \"annual\" number would suggest if you only read the headline.",
          "This is not unique to Cashalo; several Philippine lending apps use a similar daily rate plus daily fee structure. The regulatory ceiling under current rules caps the combined daily rate at 0.5 percent and effectively around 15 percent a month, 180 percent a year, for this category of lender; that ceiling tells you the legal maximum, not necessarily what you will be quoted, but it is a useful sanity check against any offer you receive."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null,
        "table": {
          "headers": [
            "Charge",
            "Rate",
            "On a 2,000 peso loan over 90 days"
          ],
          "rows": [
            [
              "Daily interest",
              "About 0.2 percent a day",
              "About 360 pesos"
            ],
            [
              "Daily service fee",
              "About 0.3 percent a day",
              "About 540 pesos"
            ],
            [
              "Combined interest and fees",
              "",
              "About 900 pesos"
            ],
            [
              "Total repayment",
              "",
              "About 2,900 pesos"
            ]
          ]
        }
      },
      {
        "heading": "Common application mistakes, and how to avoid them",
        "paragraphs": [
          "Three mistakes commonly slow down or sink a first-time Cashalo application. First, a name or detail mismatch between your valid ID, your profile, and your linked bank or e-wallet account: the facial verification and fraud checks compare these against each other, and a middle name present on the ID but missing from the profile is a common cause of a declined or delayed application. Enter your legal name exactly as it appears on the ID. Second, income proof that is too old: payslips older than the last one or two pay periods, or an outdated BIR filing, commonly trigger a request for newer documents, so submit your latest available records the first time. Third, poor facial verification conditions: the selfie needs even lighting and no hat or glasses where they obscure the match, and repeated failed attempts can lock the application while the system reviews it manually.",
          "One more worth naming: applying for the maximum amount on a first loan. First-time offers are typically smaller regardless, and asking for more than your first offer does not usually raise it, it just adds risk to the approval decision. A smaller first loan, repaid fully and on time, is what actually grows your limit for the next loan, which is the real path to larger amounts with this app."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Cashalo's products, and which one you are actually being offered",
        "paragraphs": [
          "Cashalo runs two connected products, and the cost structure differs between them, so knowing which one is in your app matters before comparing anything. CashaLoan is the cash loan: a fixed amount disbursed to your bank account or e-wallet, repaid over a fixed term, priced with the daily interest and service fee structure described above. Shop Now is the BNPL product: a purchase at a Cashalo partner merchant split into installments, commonly with promotional 0 percent or low-rate offers tied to short terms at specific merchants. A 0 percent Shop Now offer cleared on schedule is the cheapest thing in Cashalo's lineup, and a CashaLoan at the combined daily rates is the most expensive, which is why the two should never be compared as if they were one product."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "What happens if you miss a Cashalo payment",
        "paragraphs": [
          "A missed payment adds a penalty, commonly a fixed fee or a percentage of the amount due depending on your loan's terms, and repeated missed payments can affect your standing for future Cashalo offers and your credit record, since licensed lending apps report to credit bureaus. Because both the interest and the service fee accrue daily on your outstanding balance, every extra day you carry a past-due balance adds cost beyond the penalty itself, which makes a Cashalo delinquency more expensive per day than a delinquency on a flat monthly rate lender. If a payment will be hard to cover, contacting Cashalo before the due date, to ask about restructuring or a revised schedule, is a meaningfully better position than missing it first."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Repaying a Cashalo loan, step by step",
        "paragraphs": [],
        "bullets": null,
        "numbered": [
          "Check your total due in the app before your due date, since the daily accrual means the exact figure moves until you settle.",
          "Pay through the app's payment channels (GCash, Maya, banks, or payment centers), keeping the confirmation receipt until the payment posts.",
          "Pay in full on or before the due date when possible; because both charges accrue daily, early settlement genuinely reduces total cost.",
          "Confirm the payment posted and your balance shows zero, then keep the settlement confirmation for your own records.",
          "If you need more time, contact support before the due date rather than after, since a revised schedule agreed in advance is treated differently from a missed payment."
        ],
        "subheadings": null
      },
      {
        "heading": "How to actually compare this to your other debts",
        "paragraphs": [
          "Because the cost is split into two daily components instead of one headline rate, the only reliable way to compare a Cashalo balance against a credit card, a BillEase loan, or an SSS salary loan is to calculate the total amount you would actually repay over the loan's term, then convert that into an effective monthly rate yourself. Doing this by hand for every lender you owe is exactly the kind of math most people skip, which is part of why multi-lender prioritization so often defaults to \"pay whichever bill feels most urgent\" instead of \"pay whichever balance is actually costing the most.\""
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "See where a Cashalo balance actually ranks",
        "paragraphs": [
          "Enter your real total repayment amount and term, alongside anything else you owe, and Goodbye Debt's free plan converts it into an effective rate and shows you where it actually ranks in your avalanche-ordered payoff plan, rather than leaving you to annualize a daily fee structure by hand. No bank linking, manual entry or a CSV, and nothing to pay before you see the numbers."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      }
    ],
    "faq": [
      {
        "q": "How fast does Cashalo approve a first-time loan application?",
        "a": "Commonly within a day of submitting a complete application with all required documents, though first-time approved amounts tend to be smaller than what repeat, on-time borrowers are later offered."
      },
      {
        "q": "Is Cashalo's combined daily rate actually more expensive than a flat monthly rate lender?",
        "a": "Often yes, once you calculate the full term's total interest and fees and convert it to an effective monthly figure, it can land above lenders that quote a single flat monthly rate like BillEase's 3.49 percent. Comparing total repayment amount, not the headline daily percentage, is the only accurate way to check."
      },
      {
        "q": "Can I repay a Cashalo loan early?",
        "a": "Early repayment generally reduces the total interest and service fee you owe, since both are calculated on your outstanding balance over time. Confirm the exact early settlement terms in your specific loan agreement before assuming the full discount applies."
      },
      {
        "q": "What documents does a self-employed applicant need that an employed applicant does not?",
        "a": "Self-employed applicants generally substitute DTI or SEC business registration, a business permit, and bank statements or a BIR 1701 filing in place of the payslips and Certificate of Employment an employed applicant would submit."
      },
      {
        "q": "If my Cashalo application is declined, can I reapply?",
        "a": "Lending apps commonly allow reapplication after a waiting period, often with updated income documentation. Since each app weighs approval differently, a decline from one lender does not necessarily predict the outcome with another."
      }
    ],
    "ctaLead": "See your own payoff order, free",
    "ctaSub": "Add your real debts and see your avalanche-ordered plan, your projected debt-free date, and the interest you would save. No bank linking, manual entry or a CSV, and nothing to pay before you see the numbers."
  },
  {
    "slug": "bankruptcy-philippines",
    "title": "Do You Need to File Bankruptcy in the Philippines? Read This First",
    "description": "FRIA's 500,000-peso threshold, the two real tracks, and why most consumer debt has a faster, quieter path.",
    "kicker": "Probably not",
    "tldr": "Probably not, for most credit card, app loan, or personal loan debt. The closest Philippine equivalent, under the Financial Rehabilitation and Insolvency Act, is built for debts of at least 500,000 pesos and requires a court case, a lawyer, and public notice. Most people in debt have a faster, cheaper path: a real payoff plan or direct negotiation with creditors.",
    "sections": [
      {
        "heading": "There is no simple \"declare bankruptcy\" button in Philippine law",
        "paragraphs": [
          "In some countries, an individual with unmanageable debt can file a relatively standardized personal bankruptcy case. The Philippines does not have an equivalent process built for ordinary consumer debt. What exists instead is the Financial Rehabilitation and Insolvency Act of 2010 (FRIA, Republic Act 10142), and its provisions for individual debtors sit in a specific, narrower lane than most people expect when they search \"bankruptcy Philippines.\""
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The two real tracks FRIA actually offers individuals",
        "paragraphs": [
          "Suspension of payments. This track is for someone who has enough property or assets to cover their debts, but cannot currently meet payments as they fall due. You file a petition with the court, propose a payment plan to your creditors, and if creditors holding at least three-fifths of your total liabilities agree, the court can approve it and suspend pending collection actions, commonly for a period around 3 months while this plays out. This is closer to a court-supervised restructuring than anything resembling \"erasing debt.\"",
          "Voluntary or involuntary liquidation. This is the track closer to what people picture as bankruptcy: a debtor whose liabilities exceed their assets, specifically where total debt is at least 500,000 pesos, can petition to be discharged from debts through liquidation. Creditors can also force this (involuntary liquidation) if their combined claims reach that same threshold. The process involves a court-appointed liquidator, asset disclosure, and public notice through newspaper publication, then liquidation of what you own to pay creditors, after which remaining qualifying debts can be discharged."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The word \"bankruptcy\" in Philippine searches, decoded",
        "paragraphs": [
          "Most people searching this term are feeling one of three things: panic from a collector's threats (covered separately in this series: an unpaid debt by itself cannot put you in jail), overwhelm at a balance that has grown past what extra payments alone can fix, or confusion between Philippine law and the bankruptcy systems they have read about from other countries. All three are worth untangling, because each points to a different real next step.",
          "For the panic: the actual legal exposure of ordinary consumer debt is civil, not criminal, and knowing that precisely removes the fear that makes bad decisions feel urgent. For the overwhelm: the honest question is not \"how do I escape this debt\" but \"what does a realistic timeline on my actual numbers look like,\" which is answerable, usually in minutes. For the confusion: the systems in the US (Chapter 7, Chapter 13) and other countries do not map onto Philippine law, and searching with those terms in mind leads to articles that describe processes that do not exist here."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The court process, so it holds no mystery either",
        "paragraphs": [
          "If a formal FRIA proceeding is genuinely on the table, knowing the actual mechanics removes some of the dread. A voluntary petition starts with filing at the Regional Trial Court with jurisdiction over your location, along with a schedule of your assets and liabilities, a list of creditors with their addresses and claim amounts, and your proposed payment plan or liquidation intentions. The court issues a stay order suspending collection actions while the case proceeds, creditors meet and vote on a proposed plan in the suspension track, and a liquidator is appointed in the liquidation track to take inventory of assets, sell them, and distribute proceeds to creditors by legal priority. Secured creditors generally have stronger claims than unsecured ones, and the process commonly runs months to over a year depending on the complexity of the estate.",
          "Two practical realities worth naming: legal representation is effectively necessary, since the process involves formal pleadings and hearings no article can walk you through, and the public notice requirement means your financial situation becomes part of a public court record, which matters to people who took on private debt specifically to keep their situation private. Both realities are exactly why a payoff plan or a negotiated restructuring is the better first option for anything under the threshold."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Why this almost never applies to the debt that actually sends people searching this term",
        "paragraphs": [
          "The 500,000 peso threshold is doing a lot of work here. Most individual Filipinos dealing with a credit card balance, an app loan, a BNPL account, or even a bank personal loan are carrying total debt well under that figure. For that debt, a formal FRIA liquidation case is not just unnecessary, it is usually impractical: it requires legal representation, court filing costs, a public notice requirement that most people dealing with private debt specifically want to avoid, and a timeline measured in months at minimum. The process exists, correctly, for genuinely large-scale individual insolvency, not as a general-purpose debt relief tool for a stack of consumer loans."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "What FRIA does not do",
        "paragraphs": [
          "Two limits matter if you are considering this path at all. First, FRIA does not erase criminal liability. If any part of your situation involves an actual criminal matter, a bounced check under BP 22, or proven fraud under estafa, a FRIA proceeding can pause certain civil actions but does not touch the criminal case. Second, discharge under liquidation is not automatic or guaranteed; the court process examines your assets and conduct, and certain obligations can survive the proceeding depending on the circumstances."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "What most people actually need instead",
        "paragraphs": [
          "For debt under the FRIA threshold, two paths are both faster and more realistic than a court filing:",
          "Direct negotiation with your creditor. Banks and card issuers, under BSP guidance, commonly have hardship or restructuring programs: a reduced rate, an extended term, or a temporary payment pause for borrowers who ask. This is available well before any formal legal process and does not require a lawyer or a court filing, just a phone call and, usually, documentation of your financial hardship.",
          "A structured payoff plan. If your debt is manageable with a realistic timeline rather than genuinely impossible, ranking every debt by rate and directing extra payment at the most expensive balance first (avalanche order) is the most direct route to zero, without a new loan, a court case, or a public filing. This is the path that applies to the overwhelming majority of people who land on this article worried about a word, bankruptcy, that describes a process most of them do not actually need."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "When a lawyer, not an article, is the right next step",
        "paragraphs": [
          "If your total debt is genuinely above the 500,000 peso FRIA threshold, if creditors are actively pursuing a civil case against you, or if any part of your situation involves a bounced check or a fraud allegation, that is the point to talk to an actual lawyer rather than continue researching on your own. Nothing here replaces legal advice for a situation that has already reached that stage; it is meant to tell you whether you are actually in that territory before you assume you are."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "See whether a payoff plan gets you there without any of this",
        "paragraphs": [
          "Before assuming a formal legal process is your only option, it is worth seeing what a real payoff plan on your actual numbers looks like. Goodbye Debt's free plan shows your avalanche-ordered priority, your projected debt-free date, and the real interest difference a consistent plan makes, often revealing that a debt which felt overwhelming has a realistic, calm path to zero that does not involve a courtroom at all."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      }
    ],
    "faq": [
      {
        "q": "Is there a Philippine equivalent to Chapter 7 or Chapter 13 bankruptcy in the US?",
        "a": "Not a direct equivalent for ordinary consumer debt. The closest formal process, FRIA's individual insolvency provisions, is narrower, built around a 500,000 peso debt threshold and a formal court proceeding, not a routine filing for consumer debt relief."
      },
      {
        "q": "Can I use FRIA to get out of a small personal loan or credit card balance?",
        "a": "Generally no, both the suspension-of-payments and liquidation tracks are built around either a repayment proposal to creditors or a debt load meeting the 500,000 peso threshold, not a quick discharge mechanism for a single smaller account."
      },
      {
        "q": "Does filing under FRIA stop debt collectors from contacting me?",
        "a": "A court-approved suspension of payments can pause certain pending legal collection actions while the proposal is considered, but it is a formal court order obtained through a filed petition, not an automatic shield simply by announcing you intend to file."
      },
      {
        "q": "If my debt is under 500,000 pesos, what is actually my best option?",
        "a": "Directly negotiating a hardship or restructuring arrangement with your creditor, combined with a realistic payoff plan ranking your debts by rate, resolves the overwhelming majority of cases without any court involvement."
      },
      {
        "q": "Does FRIA protect my cosigner or guarantor from the debt?",
        "a": "Generally no, FRIA addresses the petitioning debtor's own obligations; a cosigner or guarantor's separate liability on the same debt is not automatically discharged just because the primary debtor's case proceeds."
      }
    ],
    "ctaLead": "See your own payoff order, free",
    "ctaSub": "Add your real debts and see your avalanche-ordered plan, your projected debt-free date, and the interest you would save. No bank linking, manual entry or a CSV, and nothing to pay before you see the numbers."
  },
  {
    "slug": "tala-vs-gcredit",
    "title": "Tala vs GCash GCredit: Which Costs You More?",
    "description": "GCredit's published rate against Tala's own disclosed effective monthly rate, with a worked 10,000-peso example.",
    "kicker": "11 to 12 percent vs 4.15 percent",
    "tldr": "GCredit charges a published 4.15 percent a month. Tala's own disclosures put its effective monthly rate at 11 to 12 percent, before a late fee. For most borrowers, GCredit is roughly a third of Tala's monthly cost, and the gap is big enough that it should decide which balance gets paid off first, not just where you borrow next.",
    "sections": [
      {
        "heading": "The two structures, side by side",
        "paragraphs": [
          "These two do not price loans the same way, so a fair comparison starts with the structure of each.",
          "GCash GCredit charges 4.1529 percent a month, a published, consistent rate applied to the amount you draw. Your GScore affects your credit limit, not the rate. If you pay on time, you pay the same rate as everyone else.",
          "Tala splits its cost into two separate charges on every loan: a one-time processing fee of 3.99 to 11.99 percent of the principal, charged each time you borrow, plus a daily service fee of 0.21 to 0.43 percent of the principal per day, charged until you finish repaying or until 61 days, whichever comes first. Loan terms run 15 to 61 days, limits run 1,000 to 25,000 pesos, and offers are personalized per customer. Tala's own published disclosure states the resulting effective monthly interest rate at 11.00 to 12.00 percent, with a maximum annual percentage rate of 141.76 percent.",
          "(These figures come from Tala's own support documentation and app listing, and GCash's published GCredit rate, as of the dates checked. Both lenders update pricing periodically, so confirm the offer in your own app before deciding.)"
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null,
        "table": {
          "headers": [
            "",
            "GCash GCredit",
            "Tala"
          ],
          "rows": [
            [
              "Monthly rate",
              "4.1529 percent, published",
              "11 to 12 percent effective, per Tala's own disclosure"
            ],
            [
              "How it is charged",
              "Flat monthly rate on the amount drawn",
              "One-time processing fee (3.99 to 11.99 percent of principal) plus a daily service fee (0.21 to 0.43 percent a day)"
            ],
            [
              "Term",
              "Monthly, renew as needed",
              "15 to 61 days"
            ],
            [
              "Credit limit",
              "Set by your GScore",
              "1,000 to 25,000 pesos, grows with on-time repayment"
            ],
            [
              "Late fee",
              "None beyond interest",
              "5 percent of the outstanding balance"
            ],
            [
              "Rate rises if you pay late",
              "No",
              "Yes, your next loan prices at the higher end"
            ],
            [
              "15,000 balance for one month",
              "About 623 pesos",
              "About 1,650 to 1,800 pesos"
            ]
          ]
        }
      },
      {
        "heading": "What the comparison actually shows",
        "paragraphs": [
          "Put the two effective monthly rates next to each other and the gap is not close: GCredit at 4.15 percent a month, Tala's own disclosure at 11 to 12 percent a month. On a 15,000 peso balance held for one month, that difference is roughly 1,050 pesos a month in interest, every month, for as long as both balances sit. The daily percentages behind Tala's structure are charged on the full borrowed amount every day, so they compound into far larger effective monthly figures than a monthly-rate lender would charge for the same balance, which is exactly why a rate table alone cannot capture the difference.",
          "A concrete 30 day example makes Tala's structure visible: borrow 10,000 pesos at a 3.99 percent processing fee plus a 0.43 percent daily service fee, and 30 days later you owe the original 10,000, plus roughly 400 pesos of processing fee, plus roughly 1,290 pesos of daily service fees, for a total near 11,700 pesos. That is roughly 17 percent of the principal in 30 days, which is what the 11 to 12 percent effective monthly rate, plus the fee structure's details, adds up to in practice.",
          "Two honest caveats. First, Tala's rates are personalized: a long, on-time borrowing history prices at the low end of each range, so an established Tala borrower pays less than a first-time one, though even that low end sits well above GCredit's published rate. Second, Tala charges you only for the days you actually need the money, so borrowing for 15 days costs meaningfully less than borrowing for 61; the effective monthly comparison assumes the balance actually sits for a month, which is exactly the situation of someone carrying the balance rather than paying it off quickly."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "What this means for which one you pay off first",
        "paragraphs": [
          "If you owe both, the honest priority order is almost always the same: avalanche order sends every extra peso to the Tala balance first, because 11 to 12 percent a month is roughly three times the cost of GCredit's 4.15 percent. Clearing Tala first, while keeping GCredit on its normal schedule, minimizes the total interest you pay across the two. If you only owe one of them, the comparison matters less for payoff priority and more the next time you are choosing where to borrow: all else equal, GCredit's published, consistent rate costs roughly a third of what Tala's structure costs for a balance held a month."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The late fee, and the cost that worsens when you struggle",
        "paragraphs": [
          "One more structural difference worth naming directly. Tala charges a late fee equal to 5 percent of your outstanding balance when a loan goes unpaid past its term, and its personalized pricing means a shaky repayment history can price your next loan at the higher end of the fee ranges. GCredit's rate does not worsen based on your repayment behavior, and your GScore affects your limit rather than your rate. If your income is irregular, that difference matters before you borrow from either, and it is exactly the kind of behavior-sensitive pricing detail that generic loan comparisons skip."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The rate math, in a single worked example",
        "paragraphs": [
          "Borrow 10,000 pesos from Tala at a 3.99 percent processing fee plus a 0.43 percent daily service fee, and repay after 30 days: you owe the original 10,000, plus roughly 400 pesos of processing fee, plus roughly 1,290 pesos of daily service fees, for a total near 11,700 pesos. Borrow the same 10,000 on GCredit at 4.1529 percent a month, and 30 days later you owe roughly 10,415 pesos. The difference is roughly 1,285 pesos on the same principal, over the same month, every time you do it.",
          "That gap is not a rounding error, it is the entire decision: on repeated monthly borrowing, the Tala structure costs roughly three times what GCredit costs, which is why this comparison deserves a full article rather than a sentence. The only common situation where the gap narrows is a borrower with a long, established on-time Tala history pricing at the bottom of Tala's fee ranges, and even that borrower typically pays more than GCredit's published rate, just by less than a first-time borrower would."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "If you owe both plus other debts, the full picture",
        "paragraphs": [
          "The Tala-versus-GCredit comparison usually sits inside a larger mix, and the honest version of this article covers that too. Take a reader with a 12,000 peso Tala loan, a 9,000 peso GCredit balance, a 40,000 peso credit card at the 3 percent cap, and an SSS salary loan at under 1 percent, with 10,000 pesos a month available above minimums. Avalanche order after converting every balance to the same unit: the Tala loan, at its disclosed 11 to 12 percent effective monthly rate, gets every extra peso first, despite being neither the largest balance nor the loudest bill. GCredit is second, the card third, and the SSS loan rides at minimums as the cheapest money in the plan. A snowball order would clear the GCredit 9,000 first for the quick win, and the cost of that choice is roughly 1,000 pesos a month in avoidable interest while the Tala balance sits, every month it sits, which is the clearest possible illustration of why rate order beats balance order at these rate gaps.",
          "The exception that actually changes the order: a GCredit balance inside its billing cycle that can be cleared interest free, or a Tala loan small enough to clear in one payment before meaningful service fees accrue. Tala charges only for the days you hold the balance, so a balance cleared within days costs a fraction of the monthly equivalent, which is why the honest answer always starts with your own numbers rather than a general ranking."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "See both balances ranked against everything else you owe",
        "paragraphs": [
          "Enter your Tala and GCredit balances with their real rates, alongside any other debt you carry, and Goodbye Debt's free plan ranks all of it in avalanche order and shows which balance is actually costing you the most right now. No bank linking, manual entry or a CSV, and nothing to pay before you see the priority list."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      }
    ],
    "faq": [
      {
        "q": "Is GCredit cheaper than Tala?",
        "a": "For a balance held a month, almost always yes. GCredit's published 4.15 percent a month sits well below Tala's own disclosed effective monthly rate of 11 to 12 percent, even at the low end of Tala's personalized ranges."
      },
      {
        "q": "What is Tala's maximum interest rate?",
        "a": "Tala's published disclosure states a maximum annual percentage rate of 141.76 percent, with an effective monthly interest rate of 11.00 to 12.00 percent, plus a late fee equal to 5 percent of the outstanding balance. Actual offers are personalized per borrower."
      },
      {
        "q": "How much does a 10,000 peso Tala loan actually cost for 30 days?",
        "a": "At Tala's published example rates (a 3.99 percent processing fee and a 0.43 percent daily service fee), roughly 1,700 pesos above the principal over 30 days, for a total near 11,700 pesos. Your own offer may differ since Tala personalizes fees per customer."
      },
      {
        "q": "Does Tala's rate go up if I pay late?",
        "a": "A payment past the term adds a late fee of 5 percent of the outstanding balance, and Tala personalizes each new loan's fees based on your repayment history, so a shaky history can price your next loan at the higher end of its ranges."
      },
      {
        "q": "If I have both a Tala loan and GCredit, which should I clear first?",
        "a": "The Tala balance, in almost every realistic case, since its effective monthly cost runs roughly three times GCredit's published rate. Enter both into a payoff plan with real rates and the order confirms itself from your actual numbers rather than a general rule."
      }
    ],
    "ctaLead": "See your own payoff order, free",
    "ctaSub": "Add your real debts and see your avalanche-ordered plan, your projected debt-free date, and the interest you would save. No bank linking, manual entry or a CSV, and nothing to pay before you see the numbers."
  },
  {
    "slug": "personal-loan-for-credit-card",
    "title": "Should I Get a Personal Loan to Pay Off My Credit Card?",
    "description": "The rate math is nearly a wash between the two good options; the decision turns on which behavior risk you can manage.",
    "kicker": "Three conditions",
    "tldr": "Usually yes on the rate math, if you can qualify. A card's rate is capped at 3 percent a month, 36 percent a year, and a typical bank personal loan runs 14 to 18 percent a year, so the structured loan is far cheaper. The two conditions that actually decide it: qualifying for the loan, and keeping the card at zero afterward.",
    "sections": [
      {
        "heading": "Why this question comes up at all",
        "paragraphs": [
          "A credit card at the BSP cap of 3 percent a month is 36 percent a year. A typical bank personal loan runs 14 to 18 percent a year. On a 100,000 peso card balance, interest alone runs 3,000 pesos a month for as long as the balance lasts, while a three-year personal loan at 15 percent carries that same 100,000 balance for about 24,800 pesos in total interest and ends on a fixed date. That gap is the honest math behind the pitch, and at the current cap it is not a small gap.",
          "The reason it still fails for a lot of people has nothing to do with the rates. It has to do with what happens after."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The failure mode nobody in the pitch mentions",
        "paragraphs": [
          "Here is the sequence that makes card-to-loan consolidation backfire: the loan pays off the card, the card's balance resets to zero, and the card is still open in your wallet. Then one month of overspending, or one emergency, and the card has a new balance again, at 36 percent a year, while the personal loan is still running its full term on the same money you already borrowed for once. Now you are paying interest on the same debt twice, through two products, and your total monthly obligations are higher than before you started.",
          "This is not a hypothetical. It is the most common real-world outcome of card-to-loan consolidation, and it is the reason the honest answer to \"should I get a personal loan to pay off my credit card\" is conditional: the loan helps only if the card stays at zero afterward, and whether the card stays at zero is a behavior question, not a rate question."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The conditions under which it genuinely helps",
        "paragraphs": [
          "Three conditions, all of which need to be true at once:",
          "All three conditions true: the loan saves real money, ends on a fixed date, and simplifies your bills into one payment. Any one of them false: you are taking on new credit to avoid a behavior problem, and the loan will likely make the situation worse within a year."
        ],
        "bullets": [
          "The loan's rate is clearly below your card's rate. This one is nearly automatic now. The BSP caps card rates at 3 percent a month, 36 percent a year, under Circular No. 1165, s.2023, and 139 of the 141 Philippine cards with a published rate charge the full 3 percent. Any bank personal loan at 14 to 18 percent a year clears that bar by a wide margin. What does not clear it: many online lending apps, whose effective rates commonly land above the card's cap. If you saw the older 2 percent monthly cap quoted somewhere, that was the COVID-era ceiling, replaced in January 2023.",
          "You can actually qualify for that lower rate. A new loan application involves a credit check, and banks weigh your existing obligations. If your card is maxed and your income is tight, you may be declined entirely, and qualification becomes the binding condition rather than the rate.",
          "The card stays at zero afterward. The only reliable ways to make this likely: close the card or stop carrying it, remove it from one-click checkout sites, and make sure your monthly budget genuinely has room for the loan payment on top of everything else. If none of those feel doable, the loan is not the fix, because the behavior it depends on is not there."
        ],
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "What to do instead if the conditions are not there",
        "paragraphs": [
          "If the bank declines the loan, or you honestly do not trust yourself to keep the card at zero, two paths are more realistic than a new loan:",
          "Call your card issuer and ask about restructuring. Under BSP guidance, card issuers commonly offer hardship programs: a reduced rate, sometimes close to 0 percent for a fixed period, a frozen penalty, or a longer term. This does not require a new credit application or a new lender, does not add a loan payment to your budget, and does not leave you with a refreshed card. You have to call and ask specifically about restructuring or a hardship program; it is not offered automatically.",
          "Run your balances in avalanche order. If you have a card plus other debts, ranking everything by rate and sending every extra peso to the highest one minimizes total interest without a new loan, a new credit check, or the refresh risk at all. If the card is your only debt, a disciplined payoff plan plus a restructuring call covers the same ground."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "A worked example with the actual peso amounts",
        "paragraphs": [
          "Concrete numbers make the decision visible. Take a 120,000 peso credit card balance at the 3 percent monthly cap, 36 percent a year. The month's finance charge alone is 3,600 pesos. Path one, a personal loan at 15 percent a year over 3 years: the monthly payment runs about 4,160 pesos, total interest about 29,750 pesos, and the card goes to zero the same week and stays there under a fixed schedule. Path two, paying the card directly at 5,000 pesos a month: the balance clears in 44 months, and total interest runs about 95,300 pesos. Path three, a minimum-style payment of 3,000 pesos a month: the balance never clears, because 3,000 does not even cover the 3,600 peso monthly charge, so the debt grows by itself every month.",
          "Read those three paths honestly, because the conclusion at the real cap is the opposite of what the retired 2 percent cap suggested. The structured loan is not roughly a wash with the disciplined direct payoff; it is about 65,600 pesos cheaper and it ends 8 months sooner. (The direct path's 44th payment is only about 370 pesos, which is why the exact total is 95,300 and not 100,000.) The direct payoff's remaining advantage is access: no application, no credit check, no new lender, and no refreshed card to resist. The loan's advantage is now decisive on both price and deadline. That makes the decision simpler than it used to be: if you can qualify and you can keep the card at zero, the loan wins on the numbers alone. If you cannot qualify, the direct payoff still works, but the payment has to clear the finance charge with real margin, and 3,000 pesos a month does not."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null,
        "table": {
          "headers": [
            "Path",
            "Monthly payment",
            "Time to clear 120,000",
            "Total interest",
            "Main risk"
          ],
          "rows": [
            [
              "Personal loan at 15 percent a year",
              "About 4,160 pesos",
              "36 months, fixed",
              "About 29,750 pesos",
              "The card refreshes while the loan runs"
            ],
            [
              "Pay the card directly",
              "5,000 pesos",
              "44 months",
              "About 95,300 pesos",
              "No fixed deadline; needs discipline"
            ],
            [
              "Minimum-style payments",
              "3,000 pesos",
              "Never clears",
              "Grows; the monthly charge alone is 3,600 pesos",
              "The debt grows by itself"
            ]
          ]
        }
      },
      {
        "heading": "The restructuring call, in more detail",
        "paragraphs": [
          "Because this option does most of the work for people who cannot qualify for a loan, it is worth more than one sentence. Card issuers in the Philippines, under BSP consumer protection guidance, commonly offer restructuring or hardship arrangements that include some combination of: a reduced monthly interest rate, sometimes close to zero for a fixed promotional period; a freeze or waiver of accumulated penalties and late fees; an extended repayment term spreading the balance over more months; and a fixed installment plan with a defined end date. What you typically need when you call: your account number, an honest statement of your financial hardship (a job loss, a medical expense, a reduced income), and sometimes supporting documents.",
          "Three things worth knowing before you call. First, the person who answers the initial hotline is not always the person who can approve a restructuring, so asking specifically for the bank's debt relief or restructuring program matters. Second, a restructuring agreement usually appears on your credit record, which is not the same as a default but is a real mark; it is still generally the better outcome than an unpaid, delinquent balance. Third, a restructured card usually gets frozen or closed, meaning no new spending on it, which is a feature rather than a bug: it forces the behavior change that the new-loan route depends on you doing yourself."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The honest version of the decision",
        "paragraphs": [
          "The decision is not \"loan or no loan.\" It is two questions: can I qualify, and can I keep the card at zero after the loan pays it off. If both answers are yes, the numbers at the current cap favor the loan clearly, about 65,600 pesos less interest on the 120,000 example with a fixed end date 8 months earlier. If either answer is no, the loan is not the fix; a restructuring call and a payoff plan are, because they change the behavior instead of hiding it behind a new product."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "See the comparison on your actual numbers",
        "paragraphs": [
          "Goodbye Debt's free plan shows you your actual balances, rates, and payoff order, and the real interest difference between your current path and a structured one, before you apply for anything anywhere. If a personal loan genuinely beats your current path, you will see that in the numbers, and if it does not, you will see that too, before you have submitted an application or taken on the refresh risk."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      }
    ],
    "faq": [
      {
        "q": "Is it smart to pay off a credit card with a personal loan?",
        "a": "It can be, under three conditions at once: the loan's rate is clearly below your card's 36 percent a year cap, you can actually qualify for that lower rate, and you keep the card at zero afterward. Miss any one of the three and the loan usually makes things worse, not better."
      },
      {
        "q": "Will a personal loan hurt my credit score?",
        "a": "The application involves a credit check, a normal part of any loan application. What matters more for your overall standing is whether the card you paid off stays at a zero balance instead of being used again on top of the new loan."
      },
      {
        "q": "Can I use a personal loan to pay off multiple cards at once?",
        "a": "Yes, loan proceeds are yours to allocate, including across several cards. The same three conditions apply, and with several cards the refresh risk is higher, since there are more open cards that can accumulate new balances while the loan runs."
      },
      {
        "q": "What is the typical interest rate on a bank personal loan in the Philippines?",
        "a": "Commonly 14 to 18 percent a year, well below the 36 percent a year cap on credit card rates, which is why card-to-loan consolidation saves real money at the current cap when the other conditions are met."
      },
      {
        "q": "What if I cannot qualify for a personal loan at a lower rate?",
        "a": "Then the loan does not help. Calling your card issuer about a hardship or restructuring program, combined with a disciplined payoff plan on your actual balances, is the more realistic path, and it does not require qualifying for new credit at all."
      }
    ],
    "ctaLead": "See your own payoff order, free",
    "ctaSub": "Add your real debts and see your avalanche-ordered plan, your projected debt-free date, and the interest you would save. No bank linking, manual entry or a CSV, and nothing to pay before you see the numbers."
  },
  {
    "slug": "credit-card-statement",
    "title": "How to Read Your Credit Card Statement (and What 3% Monthly Interest Actually Means)",
    "description": "The BSP rate cap, the minimum payment trap in real numbers, and the added charges that push costs past 3 percent a month.",
    "kicker": "The 3 percent question",
    "tldr": "The number that matters is your monthly rate: the BSP cap is 3 percent a month, 36 percent a year, and 139 of the 141 cards with a published rate charge the full 3 percent. Statement reading is finding three things: the rate, the minimum payment due, and the due date.",
    "sections": [
      {
        "heading": "The three things to find on every statement",
        "paragraphs": [
          "Credit card statements are dense, but almost all of it is detail you can skim past. Three items actually matter for how much the card is costing you:"
        ],
        "bullets": null,
        "numbered": [
          "The interest rate applied to your outstanding balance. Since January 2023, the BSP caps the monthly interest rate on a card's unpaid balance at 3 percent a month, 36 percent a year, under Circular No. 1165. On a 50,000 peso balance, that is up to 1,500 pesos a month in interest alone, before any other charges. Nearly every card in the market charges the full cap: 139 of the 141 Philippine cards with a published rate sit at 3 percent.",
          "The minimum payment due. This is the amount that keeps you out of delinquency but does not necessarily reduce your balance at all. On a 50,000 peso balance, the minimum is commonly a small percentage of the balance plus fees and past-due amounts. At the 3 percent cap, that minimum can be smaller than the month's interest alone, meaning a minimum-only payer's balance grows instead of shrinking.",
          "The payment due date. Missing it adds a late payment fee, and a missed payment can also add the unpaid interest to the balance, compounding the cost. Payments are considered on time if received on or before the due date."
        ],
        "subheadings": null
      },
      {
        "heading": "What the 3 percent monthly cap actually covers, and what it does not",
        "paragraphs": [
          "The BSP ceiling on the monthly interest rate for a credit card's unpaid balance is 3 percent, set by Circular No. 1165, s.2023, which replaced the 2 percent COVID-era cap in January 2023. The cap does not cover everything on the statement. Separate charges sit on top of it:",
          "So the cap limits the interest charge on your balance, not the total cost of a neglected card. A balance at the full 3 percent a month doubles roughly every two years if untouched, and the interest alone on a 50,000 peso balance is 1,500 pesos a month, every month, for as long as the balance sits there."
        ],
        "bullets": [
          "Late payment fees (capped separately, commonly a fixed peso amount or a percentage of the unpaid amount, whichever applies)",
          "Annual membership fees (waived or not, depending on the card)",
          "Cash advance interest at the same 3 percent monthly cap, plus a processing fee of at most 200 pesos per transaction, with no other fee allowed on the advance",
          "Installment purchases converted on the card, capped at a monthly add-on rate of 1 percent"
        ],
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The minimum payment trap, in real numbers",
        "paragraphs": [
          "Here is the arithmetic that makes minimum payments expensive, and at the current cap it is worse than most people assume. On a 50,000 peso balance at 3 percent a month interest, the monthly interest alone is 1,500 pesos. A common minimum payment formula is the greater of a small percentage of the balance or a flat minimum, commonly a few hundred pesos. If your minimum comes to 1,250 pesos, it is smaller than the month's 1,500 peso interest charge. The shortfall, 250 pesos this month, is added to the balance, and next month's interest is computed on the bigger number. At that pace the balance does not fall slowly; it rises by itself, before you spend a single peso on the card.",
          "That is the trap in its sharpest form: a minimum payment below the month's interest is the point where the debt grows with no help from you. Issuers set minimums by formula, so the exact crossover point depends on your card, but the honest check takes one line: compare your minimum due with the finance charge on the same statement. If the minimum is smaller, the account is growing at zero spending. The right target is always the full statement balance or at least the balance plus this month's interest, not the minimum."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The 3 percent question, answered directly",
        "paragraphs": [
          "The H1 of this article promises an answer on the 3 percent monthly figure, so here it is plainly. Three percent a month is the legal cap itself. Since January 2023, BSP Circular No. 1165 caps card interest on the unpaid balance at 3 percent a month, 36 percent a year, and 139 of the 141 Philippine cards with a published rate charge the full amount. If your statement's rate section shows 3 percent, that is the cap, not an anomaly and not a sign of a neglected card.",
          "The 2 percent figure you may still see on comparison sites is the retired COVID-era ceiling under the older circular, replaced in January 2023 and quoted by pages that have not updated. What pushes a card's cost past 3 percent a month is not the interest rate; it is the added charges: late fees after a missed due date, the annual membership fee, and cash advance costs, where the processing fee is capped at 200 pesos per transaction but the advance itself accrues interest at the same 3 percent cap while it is outstanding. A card paid on time and never used for cash advances costs its rate, and at the full cap that rate is 3 percent a month. Which is why reading the statement line by line matters: the rate line tells you the interest; the other lines tell you what you are actually paying."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The annual fee, the added charges, and what to question on your own statement",
        "paragraphs": [
          "Two statement items deserve a closer look than most people give them. The annual membership fee, commonly 1,500 to 3,500 pesos depending on the card, is charged automatically and is often waivable: a call to the issuer, especially before renewal, commonly gets it waived or reduced for cardholders in good standing, something the statement itself never advertises. The added charges section (late fees, cash advance fees and interest, anything outside the monthly finance charge) is worth checking line by line, because errors happen and because cash advance costs are easy to forget: the processing fee is capped at 200 pesos per transaction and no other fee is allowed on the advance, but the advance itself accrues interest at the same 3 percent monthly cap while outstanding, which is why using a cash advance for anything but a genuine emergency is usually the most expensive money on the whole card."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "How to actually pay off a card balance",
        "paragraphs": [
          "Once you know your real balance, real rate, and real minimum, the payoff path is straightforward:"
        ],
        "bullets": null,
        "numbered": [
          "Pay more than the minimum, every month, by a specific amount. On that same 50,000 balance at the 3 percent cap, the minimum plus 2,000 pesos a month (about 3,250) clears it in roughly 21 months with about 18,000 pesos of total interest, and it is the smallest realistic version of a payoff payment: at 1,250 the balance grows instead of falling. The specific extra amount matters less than its existence: a fixed, repeatable amount you can sustain, not a different amount every month based on what is left over.",
          "Stop using the card while you are paying it down. Every new purchase at 3 percent a month costs more than the same item on a debit card or cash. Every new purchase also resets the payoff math, because the balance you are attacking is now bigger again.",
          "Pay before the due date, every month, on time. This avoids late fees and keeps the account in good standing, which matters for your credit record and for any future restructuring conversation with the issuer."
        ],
        "subheadings": null
      },
      {
        "heading": "If the card is one of several debts you owe",
        "paragraphs": [
          "A card at 3 percent a month is usually not your most expensive debt in the Philippines, where app-based lending platforms commonly price at 4 to 15 percent a month depending on the lender. The honest priority order sends extra payment to the most expensive balance first (avalanche order), which often means a Tala or GCredit balance ahead of the card, with the card second and any low-rate government loan last. If you are juggling several accounts and are not sure which is actually costing you the most, that is a two minute check with real numbers, not a guess based on which bill feels most urgent this week."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "See the real cost of every balance you carry",
        "paragraphs": [
          "Enter your real card balance and rate, alongside anything else you owe, and Goodbye Debt's free plan shows your avalanche-ordered priority across all of it, your projected debt-free date, and the real interest difference between paying minimums forever and a consistent plan that actually clears the balances."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      }
    ],
    "faq": [
      {
        "q": "Is credit card interest really capped at 2 percent a month in the Philippines?",
        "a": "No, not anymore. Two percent a month was the COVID-era ceiling under the older circular; it was replaced in January 2023 by BSP Circular No. 1165, which caps the monthly rate on the unpaid balance at 3 percent, 36 percent a year. 139 of the 141 Philippine cards with a published rate charge the full 3 percent. What sits on top of the cap is fees, not interest: late fees, annual fees, and the cash advance processing fee capped at 200 pesos per transaction."
      },
      {
        "q": "What happens if I pay only the minimum due?",
        "a": "The account stays current and out of delinquency, but at the 3 percent cap on a 50,000 peso balance, the monthly interest alone is 1,500 pesos. If your issuer's minimum formula lands below that, the balance grows at zero spending instead of slowly falling, so check the minimum against the finance charge on the same statement."
      },
      {
        "q": "Does paying before the due date reduce interest?",
        "a": "Paying on time avoids late fees and keeps the account current; interest is charged on the balance you carry, so paying more, earlier, is the only thing that meaningfully reduces the interest you pay. The due date matters for fees and standing, the balance matters for interest."
      },
      {
        "q": "What is the minimum payment on a 50,000 peso balance?",
        "a": "It depends on your issuer's formula, commonly the greater of a small percentage of the balance or a flat minimum. Whatever the exact figure, interest on that balance at the 3 percent cap is 1,500 pesos a month alone, so a minimum near 1,250 pesos does not reach principal at all; the shortfall adds to the balance instead."
      },
      {
        "q": "Should I pay off my card or my Tala loan first?",
        "a": "Compare effective monthly rates directly. A card is capped at 3 percent a month, below common app-based lender rates of 4 to 15 percent a month, so in most cases the app loan is the more expensive debt and gets the extra payment first, with the card second."
      }
    ],
    "ctaLead": "See your own payoff order, free",
    "ctaSub": "Add your real debts and see your avalanche-ordered plan, your projected debt-free date, and the interest you would save. No bank linking, manual entry or a CSV, and nothing to pay before you see the numbers."
  },
  {
    "slug": "full-lender-comparison",
    "title": "Tala vs Home Credit vs BillEase vs Cashalo: The Full Lender Comparison",
    "description": "Every major Philippine lender converted to the same unit and ranked cheapest to most expensive, with the worked payoff example.",
    "kicker": "All four, same unit",
    "tldr": "On a 20,000 peso loan over 30 days, effective monthly costs run cheapest first: BillEase at 3.49 percent a month, Home Credit around 2.8 to 4.4 percent effective, Tala's disclosed effective monthly rate at 11 to 12 percent, and Cashalo's combined daily structure highest of the four. Comparing total repayment, not headline rates, makes the order stick.",
    "sections": [
      {
        "heading": "The one rule that makes lender comparison work",
        "paragraphs": [
          "Lenders in the Philippines price loans in at least three different structures: a flat monthly rate, a daily rate, and a daily rate plus a separate daily fee. Comparing a 3.49 percent monthly rate directly against a 0.43 percent daily fee is meaningless without converting both to the same unit. The only reliable comparison is the total amount you would actually repay, over the same principal and the same term, converted to an effective monthly cost. Do that one conversion and the whole field falls into a clear order."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The four lenders, converted to the same unit",
        "paragraphs": [
          "All four price a 20,000 peso loan; here is what each structure produces, converted to an effective monthly cost:",
          "BillEase quotes a flat 3.49 percent a month on its standard plans, on the declining balance. On a 20,000 peso balance held for a month, that is roughly 700 pesos. EasyPace runs 4.16 percent a month for longer terms. The rate is published, consistent, and simple to compare, which makes BillEase the most transparent of the four.",
          "Home Credit prices its cash loan product with a commonly cited effective rate around 2.8 percent a month on some shorter plans, with longer installment plans pricing higher; a worked example on a 20,000 peso loan over 6 months commonly lands around a 15 percent total add-on charge, which converts to roughly a 4.4 percent effective monthly cost over that term. Home Credit's product mix is broad (installments, cash loans, device financing), so the exact structure depends on which product you are offered. Confirm which product applies before comparing.",
          "Tala splits its cost into a one-time processing fee (3.99 to 11.99 percent of the principal) plus a daily service fee (0.21 to 0.43 percent of the principal per day, charged until repayment or 61 days). Terms run 15 to 61 days, limits 1,000 to 25,000 pesos. Tala's own published disclosure states the resulting effective monthly interest rate at 11.00 to 12.00 percent, with a maximum APR of 141.76 percent. On a 20,000 balance held a month, that is roughly 2,200 to 2,400 pesos.",
          "Cashalo combines a daily interest rate and a separate daily service fee, both on the outstanding balance. A published worked example (a 2,000 peso loan over 90 days at roughly 0.2 percent plus 0.3 percent a day) worked out to roughly 45 percent of the principal in combined interest and fees over three months, which converts to roughly a 15 percent effective monthly cost. Regulatory rules cap the combined daily rate at 0.5 percent, which is the legal ceiling for this category, not necessarily what you will be quoted.",
          "(These figures come from each lender's own disclosures and published sources as of the dates checked. All four update pricing periodically, and Tala and Cashalo personalize offers per borrower, so confirm the offer in your own app before deciding.)"
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The order, cheapest to most expensive",
        "paragraphs": [
          "On a balance held for a month, cheapest first:",
          "The gap between cheapest and most expensive is more than four times, on the same principal, over the same month. That spread is the entire reason a payoff order built on real rates, rather than on which bill feels most urgent, saves real money: sending an extra 5,000 pesos to the wrong one of these four costs you several hundred pesos a month in avoidable interest for as long as the balance sits."
        ],
        "bullets": null,
        "numbered": [
          "BillEase, 3.49 percent a month, roughly 700 pesos on a 20,000 balance.",
          "Home Credit, commonly cited around 2.8 to 4.4 percent effective monthly depending on the product and term, roughly 560 to 880 pesos on the same balance.",
          "Tala, its own disclosed 11 to 12 percent effective monthly, roughly 2,200 to 2,400 pesos on the same balance.",
          "Cashalo, roughly 15 percent effective monthly in the published worked example, roughly 3,000 pesos on the same balance, at the top of this category's legal ceiling."
        ],
        "subheadings": null,
        "table": {
          "headers": [
            "Lender",
            "Pricing structure",
            "Effective monthly cost",
            "Cost on 20,000 for a month",
            "Rate type"
          ],
          "rows": [
            [
              "BillEase",
              "Flat rate on the declining balance",
              "3.49 percent",
              "About 700 pesos",
              "Published"
            ],
            [
              "Home Credit",
              "Add-on charges, vary by product and term",
              "About 2.8 to 4.4 percent",
              "About 560 to 880 pesos",
              "Offer screen"
            ],
            [
              "Tala",
              "Processing fee plus daily service fee",
              "11 to 12 percent (own disclosure)",
              "About 2,200 to 2,400 pesos",
              "Personalized"
            ],
            [
              "Cashalo",
              "Daily interest plus daily service fee",
              "Up to about 15 percent",
              "Up to about 3,000 pesos",
              "Personalized"
            ]
          ]
        }
      },
      {
        "heading": "What this means for your payoff order",
        "paragraphs": [
          "If you owe more than one of these four, avalanche order is simple once the rates are in the same unit: extra payment goes to Cashalo or Tala first, Home Credit second, BillEase last (all else equal, and adjusting for whatever your own app actually shows you, since Tala and Cashalo personalize). If you owe only one, the comparison matters for the next time you borrow rather than for payoff priority: all else equal, BillEase's flat, published rate is the most predictable, and its rate does not change based on your repayment behavior the way Tala's and Cashalo's personalized structures do."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The behavioral cost structures, worth naming",
        "paragraphs": [
          "Two of the four (Tala, Cashalo) personalize pricing to your repayment history, which means a late payment does not just add a penalty, it can raise the cost of your next loan. The other two (BillEase, Home Credit) price published rates that do not worsen based on behavior. If your income is irregular, that structural difference is worth factoring in before borrowing from any of the four, since the same late month can cost you more than the penalty alone with the personalized lenders."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "How BillEase and Home Credit actually differ structurally",
        "paragraphs": [
          "Since the two occupy adjacent positions in the ranking, the structural difference is worth spelling out. BillEase prices a flat monthly rate on the declining balance, applies it identically to BNPL and cash products, and publishes it openly. Home Credit prices its product mix with add-on charges that are disclosed at the offer screen but are less uniform across products: a cash loan's effective cost differs from a device installment plan's, and the effective rate depends on the term chosen. The practical difference for a borrower: BillEase's cost is predictable from one number, Home Credit's depends on the product and term you are actually offered, so the honest comparison requires reading the specific offer screen rather than a general rate table. Neither structure is wrong, but they answer \"how much does this cost\" differently: one with a single number, the other with a number per product per term, which is why the same-lens conversion in this article is the only comparison method that works across all four lenders."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "If you owe more than one of these, a worked payoff example",
        "paragraphs": [
          "Take a reader with three balances: a 15,000 peso CashaLoan, a 20,000 peso Tala loan, and a 10,000 peso BillEase balance, with 8,000 pesos a month available above minimums. Avalanche order after converting everything to the same unit: the CashaLoan (highest effective monthly cost) gets every extra peso first, Tala second, BillEase last on its normal schedule. The counterintuitive part is that the smallest balance, the BillEase 10,000, is the last one cleared, even though a snowball approach would clear it first for the psychological win. The reason: at these rate gaps, the interest saved by attacking the expensive balances first is several hundred pesos a month, real money, while the quick win of clearing the cheapest balance first saves almost nothing in interest. The honest exception: if the BillEase balance were a 0 percent partner offer inside its grace window, it would jump to the top of the list despite being the smallest and cheapest, because a 0 percent balance converts to the most expensive debt in the plan the moment the grace window closes and the standard rate applies retroactively."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "See all your lenders converted to the same unit",
        "paragraphs": [
          "Goodbye Debt's free plan does exactly this conversion for you: enter any debt with a balance and its real cost, and see every lender you owe ranked in avalanche order, in the same unit, with your projected debt-free date. No bank linking, manual entry or a CSV, and nothing to pay before you see the full ranked list."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      }
    ],
    "faq": [
      {
        "q": "Which is cheapest: Tala, Home Credit, BillEase, or Cashalo?",
        "a": "On a balance held a month, BillEase's flat 3.49 percent a month is usually cheapest, followed by Home Credit's commonly cited 2.8 to 4.4 percent effective range, then Tala's disclosed 11 to 12 percent effective monthly, then Cashalo's structure, which landed near 15 percent effective monthly in a published worked example."
      },
      {
        "q": "Why can I not just compare the advertised rates directly?",
        "a": "Because the four lenders use different structures: a flat monthly rate, a daily rate, and a daily rate plus a daily fee. Direct comparison of numbers in different units is meaningless; converting all of them to total repayment over the same principal and term is the only reliable method."
      },
      {
        "q": "Does Tala really cost 11 to 12 percent a month?",
        "a": "That is Tala's own published disclosure of its effective monthly interest rate, derived from its processing fee plus daily service fee structure, before the 5 percent late fee. Personalized offers vary, and borrowing for fewer days costs less than the monthly equivalent."
      },
      {
        "q": "Is Cashalo's cost actually higher than Tala's?",
        "a": "In the published worked example, Cashalo's combined daily interest and fee structure landed near 45 percent of the principal over 90 days, which converts to a higher effective monthly cost than Tala's disclosed rate. Both personalize offers, so your own app's numbers can differ; calculate your own total repayment before deciding."
      },
      {
        "q": "Which one should I pay off first if I owe several of these?",
        "a": "Convert each to the same unit (total repayment over its own term, or effective monthly cost), rank them, and send every extra peso to the top of that list. In most real mixes that puts Cashalo or Tala first, Home Credit second, and BillEase last, but your own app's actual numbers decide the order."
      }
    ],
    "ctaLead": "See your own payoff order, free",
    "ctaSub": "Add your real debts and see your avalanche-ordered plan, your projected debt-free date, and the interest you would save. No bank linking, manual entry or a CSV, and nothing to pay before you see the numbers."
  },
  {
    "slug": "multiple-loan-app-installments",
    "title": "Juggling Multiple Loan App Installments? How to Tell Which One Is Actually Hurting You Most",
    "description": "Convert every installment plan to the same unit, rank them, and find the balance actually draining the most money.",
    "kicker": "The same-unit conversion",
    "tldr": "Convert every installment plan to the same unit, total repayment over its own term or effective monthly cost, then rank them. The loudest bill is rarely the most expensive one: installment plans with promotional headlines often hide the highest effective rates behind small per-installment amounts that look manageable.",
    "sections": [
      {
        "heading": "Why the loudest bill is usually not the most expensive debt",
        "paragraphs": [
          "When several installment plans are active at once, the natural instinct is to prioritize whichever one sends the most reminders or has the nearest due date. That instinct optimizes for this week's noise, not for total cost. A 1,200 peso installment due every two weeks feels heavier than a quiet balance quietly costing 4 percent a month, but the quiet balance is the one that actually drains the most money over time. Ranking by noise instead of by rate is one of the most common ways multi-debt prioritization goes wrong, and it is fixable with one conversion."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The three structures Philippine lenders actually use",
        "paragraphs": [
          "Nearly every plan you are juggling uses one of these three pricing structures:",
          "The reason juggling these feels impossible: a 0.43 percent daily fee, a 3.49 percent monthly rate, and a 15 percent total add-on are three different units. None of them can be compared to another directly. Converting all three to the same unit is the whole trick, and it takes minutes with a calculator."
        ],
        "bullets": [
          "Flat monthly rate on the declining balance. BillEase's 3.49 percent a month, bank personal loans, government salary loans. The cost is a single number, applied to what you still owe, and it falls as you pay down.",
          "One-time fee plus daily rate. Tala's structure: a one-time processing fee of 3.99 to 11.99 percent of the principal, plus a daily service fee of 0.21 to 0.43 percent of the principal per day until repayment or 61 days. Tala's own published disclosure puts the effective monthly rate at 11.00 to 12.00 percent.",
          "Daily rate plus daily fee, or add-on charges. Cashalo's combined daily structure, and BNPL offers priced as an add-on percentage of the principal (a published Home Credit example worked out to roughly 15 percent total add-on over a 6 month term, converting to roughly a 4.4 percent effective monthly cost)."
        ],
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The conversion, step by step",
        "paragraphs": [
          "A worked example across three real plans: a 15,000 peso CashaLoan whose total repayment is roughly 21,000 pesos over 3 months (fees and charges: 6,000, monthly cost: 2,000, effective monthly rate: roughly 13 percent); a 20,000 peso Tala loan at its disclosed 11 to 12 percent effective monthly rate; and a 12,000 peso BillEase balance at 3.49 percent. The ranking that comes out: CashaLoan first, Tala second, BillEase last. Note what happened: the plan with the smallest advertised numbers (the CashaLoan's daily percentages sound tiny) ranked first, and the plan with the most official-sounding rate (BillEase's flat 3.49) ranked last. That inversion is the normal result of doing this conversion honestly, and it is why the loudest or most official-looking bill is so often not the most expensive one."
        ],
        "bullets": null,
        "numbered": [
          "For each plan, write down the total amount you would actually repay: the principal, plus every fee, plus every interest charge over the full term. Lender apps commonly show this as the total installment amount or the total due.",
          "Divide the total fees and charges (everything above the principal) by the number of months in the term. That is the average monthly cost of the plan.",
          "Divide that monthly cost by the principal. That is the effective monthly rate, in the same unit for every plan regardless of how the lender priced it.",
          "Rank the plans by that effective monthly rate. The top of the list is the one actually hurting you most."
        ],
        "subheadings": null
      },
      {
        "heading": "What to do with the ranking",
        "paragraphs": [
          "Once the list is ranked, the payoff logic is the standard one: pay every minimum on schedule to keep every account current, then send every extra peso to the top of the list. When the top plan clears, its payment rolls into the next one, and so on. This is avalanche order, applied to installment plans instead of balances, and it minimizes total interest across everything you owe.",
          "Two situations need special handling. A 0 percent promotional installment (a partner-merchant offer with a grace window) sits at the bottom of the rate ranking, but it becomes the most expensive debt in your plan the moment the grace window closes and the standard rate applies retroactively, so it belongs at the top of your attention even while its rate is zero. And an installment plan whose lender personalizes pricing to repayment history (Tala, Cashalo) means a late payment can raise the cost of your next loan, so keeping every account current is not just about penalties, it protects your future rates too."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "What this changes about how you juggle the payments",
        "paragraphs": [
          "Once the ranking exists, it changes three things about how the payments actually go out. First, payment order stops being decided by due-date proximity: every minimum still gets paid on its own schedule, but the extra peso goes to the top of the rate ranking regardless of which due date is nearest, which is the difference between optimizing for this week and optimizing for total cost. Second, the freed-up payment from a cleared plan rolls into the next one deliberately: when the CashaLoan in the worked example clears, its 2,000 pesos a month does not get absorbed back into spending, it adds to whatever was going to the Tala loan, which is the compounding mechanism that makes later payoffs faster than earlier ones. Third, the quiet balance stops being invisible: ranked in one place, the plan that sends the fewest reminders is seen every week in the same check as the loud ones, which removes the specific failure mode where a quiet, expensive balance sits untouched for months because nothing about it ever felt urgent."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The free tier limit, honestly stated",
        "paragraphs": [
          "Most juggling situations involve three or more active plans, which is more than Goodbye Debt's free plan runs its full engine on (two debts). The free plan still shows your two most expensive balances and the avalanche order between them, your projected debt-free date, and the real interest difference a consistent order makes. The paid tier removes the two-debt limit, adds snowball and a custom hybrid strategy, and adds bulk CSV import for getting several app statements in at once. If you are juggling four or five plans, that is the version built for exactly this situation.",
          "One more honest note on what the free plan does not do: it does not link to banks or lending apps automatically, so your installment plans are entered by hand, one at a time, from each lender's app or statement screen. That is deliberate (no bank credentials in a third-party app, which matters for accounts with collection powers) but it does mean the first setup takes fifteen to twenty minutes for a four or five plan situation, once, not every week. The weekly check after setup is the five-minute single-view habit described above, which is the whole point: one session of setup friction buys a permanent single view of every balance you owe."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "See which plan is actually hurting you most",
        "paragraphs": [
          "Enter your real plans with their real total repayment amounts, and Goodbye Debt converts every one to the same unit, ranks them, and shows your projected debt-free date. No bank linking, manual entry or a CSV, and nothing to pay before you see the ranked list."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      }
    ],
    "faq": [
      {
        "q": "How do I compare a daily-rate loan against a monthly-rate loan?",
        "a": "Convert both to the same unit first: total repayment over each plan's own term, divided into an average monthly cost, then an effective monthly rate. Comparing a daily percentage directly against a monthly percentage is meaningless without that conversion."
      },
      {
        "q": "Which installment plan should I pay off first?",
        "a": "The one with the highest effective monthly rate after conversion, which in most real Philippine mixes puts a daily-rate app loan ahead of a flat-rate BNPL or bank loan. The exception is a 0 percent promotional offer: at zero interest it ranks last, but the moment its grace window closes and the standard rate applies retroactively, it becomes the most expensive debt in the plan."
      },
      {
        "q": "Is the installment with the smallest monthly payment the cheapest?",
        "a": "Usually not. Small per-installment amounts often hide high effective rates spread over long terms, which is exactly the pattern the conversion in this article exposes. The cheapest plan is the one with the lowest effective monthly rate, not the smallest payment."
      },
      {
        "q": "What if two plans have almost the same effective rate?",
        "a": "Then the order between them barely affects total interest, and you can break the tie by clearing whichever one is smaller first for the psychological win, a case where snowball logic genuinely agrees with avalanche logic."
      },
      {
        "q": "Can I track several installment plans without paying for anything?",
        "a": "Yes: Goodbye Debt's free plan shows your two most expensive balances in one view with your projected debt-free date, no bank linking and nothing to pay. If you are juggling four or five plans, the paid tier removes the limit and adds bulk CSV import for exactly that situation."
      }
    ],
    "ctaLead": "See your own payoff order, free",
    "ctaSub": "Add your real debts and see your avalanche-ordered plan, your projected debt-free date, and the interest you would save. No bank linking, manual entry or a CSV, and nothing to pay before you see the numbers."
  },
  {
    "slug": "utang-sss-credit-card-kamag-anak",
    "title": "Utang sa SSS, Credit Card, at Kamag-anak? Alin ang Babayaran Muna",
    "description": "SSS loan, credit card, at kamag-anak utang: ang totoong presyo ng bawat isa, ang tamang payoff order, at ang tunay na maximum ng SSS salary loan ngayon.",
    "kicker": "SSS, card, at kamag-anak",
    "tldr": "I-rank ang tatlong utang ayon sa tunay na interest, hindi sa lakas ng kulit. Sa halimbawa sa ibaba: credit card muna (3 percent kada buwan), SSS salary loan pangalawa (8 percent kada taon), kamag-anak kahuli-hulihan (zero interest). Bayaran ang minimum sa lahat, at ang bawat sobrang piso, sa pinakamahal na utang.",
    "sections": [
      {
        "heading": "Bakit delikado ang sundan ang lakas ng kulit",
        "paragraphs": [
          "Tatlong umutang sa iyo, tatlo rin ang magkaibang personalidad nila. Ang kamag-anak ay maaaring mag-text o magpaka-enggrande sa salu-salo, kaya siya ang palaging naririnig mo. Ang credit card ay tahimik: isang email kada buwan, isang statement na madaling ipagpaliban. Ang SSS salary loan, kung employed ka, ay hindi na nga humihingi sa iyo dahil kusa itong ibinabawas sa sahod.",
          "Ang natural na instinto ay bayaran ang pinakamakulit. Ang problema: hindi pera ang pinakamakulit, at madalas ang pinakatahimik na utang ang siyang kumakain ng pinakamalaking pera kada buwan. Ang utang na may 3 percent kada buwan na finance charge ay hindi nagsisigaw, ngunit kada buwan na hindi ito bumababa ay may 900 pesos kang nawawala sa isang 30,000 na balance. Ang pag-order base sa ingay, sa damdamin, o sa pinakamalapit na due date ay isa sa pinakakaraniwang pagkakamali sa prioritization, at kaya ito ng isang simpleng ranking."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Ang tunay na halaga ng bawat utang",
        "paragraphs": [
          "Bago mag-rank, kilalanin muna ang bawat isa sa totoong presyo nito.",
          "Ang credit card ang pinakamahal na utang sa listahan. Sa ilalim ng BSP Circular 1165 (s. 2023), ang interest o finance charge ng credit card ay may cap na 3 percent kada buwan, o 36 percent kada taon. At hindi ito teoretikal: sa 141 na Philippine card na may published rate, 139 ang siningil sa buong 3 percent. Sa 30,000 na balance, ang finance charge ay mga 900 pesos kada buwan. Ang mas malala, sa maraming card ay halos pantay o mas maliit pa ang minimum due kaysa finance charge: sa 50,000 na balance, ang buwanang singil ay mga 1,500 pesos habang ang karaniwang minimum na 1,250 ay hindi man lang nito natatakpan, kaya lumalaki ang utang kahit nagbabayad ka.",
          "Ang SSS salary loan ay mura pero may sariling mga patakaran. 8 percent kada taon sa diminishing balance ang presyo nito para sa member na malinis ang record (tataas sa 10 percent kada taon kung nag-avail ka ng penalty condonation sa nakalipas na 5 taon), 24 na buwanang installment, may 1 percent na service fee na ibabawas sa proceeds, at may pro-rated na advance interest din na ibabawas. Ang isang maximum na one-month loan na 20,000 pesos ay mga 904.55 kada buwan sa loob ng 24 buwan, kabuuang mga 21,709, kaya mga 1,709 lang ang interest sa buong term. Sa parehong halaga, ang credit card ay maaaring umabot ng sampung libo o higit pa. Pero tandaan: mura ito habang current ka. Kapag lumagpas sa due date, may 10 percent kada taon na interest at 1 percent kada buwan na parusa ayon sa Circular 2025-004 coverage, at hindi ka makakapag-renew habang may past due na salary loan.",
          "Ang kamag-anak ay zero interest pero walang kontrata. Walang statement, walang due date, walang naka-print na schedule. Ang interest nito sa pera ay zero, pero may iba itong gastos: lumalaki ang utang sa alaala hindi sa papel, at ang \"bayaran kita kapag may extra\" ay madalas hindi nangyayari. Ang utang na ito ang pinaka-stressful minsan kahit pinakamura sa math."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Ang rule: parehong yunit bago mag-rank",
        "paragraphs": [
          "Ang tatlong utang ay naka-price sa tatlong magkaibang yunit, kaya hindi sila diretsonag-pagtapat na mapagkukumpara. I-convert muna sa parehong yunit, ang effective na buwanang presyo:",
          "Pagkatapos ng conversion, ang rule ay simple: bayaran ang minimum ng bawat utang para walang maging past due, at ang bawat sobrang piso ay ipadala sa tuktok ng ranking. Kapag natapos ang una, ang pondo nito ay lumilipat sa susunod, at ganito tuloy-tuloy hanggang matapos. Ito ang avalanche order, at ito ang nagpapababa ng kabuuang interest."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null,
        "table": {
          "headers": [
            "Utang",
            "Presyo",
            "Effective kada buwan"
          ],
          "rows": [
            [
              "Credit card",
              "3 percent kada buwan na finance charge (BSP cap)",
              "3 percent"
            ],
            [
              "SSS salary loan",
              "8 percent kada taon, diminishing",
              "mga 0.67 percent"
            ],
            [
              "Kamag-anak",
              "walang interest",
              "0 percent"
            ]
          ]
        }
      },
      {
        "heading": "Worked example: 30,000 card, 20,000 SSS, 15,000 kamag-anak",
        "paragraphs": [
          "Ilagay natin sa totoong sitwasyon ang tatlo: 30,000 na credit card balance, 20,000 na natitira sa SSS salary loan, at 15,000 sa kamag-anak.",
          "Ang SSS loan, kung employed ka, nagbabayad na sa sarili nito sa payroll deduction, kaya hindi ito ang tunay na laban. Ang tunay na laban ay credit card laban sa kamag-anak, at hindi ito malapitang laban.",
          "Sa credit card na 30,000: kung 2,000 pesos kada buwan ang ilalagay mo, aabutin ito ng mga 21 na buwan at mga 10,456 pesos na interest. Kung kaya mong taasan sa 3,000, 13 buwan na lang at mga 6,203 pesos. Ang dagdag na 1,000 kada buwan ay pumapatay ng 8 buwan at mga 4,250 pesos ng interest, dahil bawat pisong pumapasok sa 3 percent kada buwan na utang ay kumikita sa iyo ng 36 percent kada taon sa naiwasang singil. Ang parehong piso sa SSS loan ay nag-iipon lang ng 8 percent kada taon, at sa kamag-anak ay zero.",
          "At kung hindi uusad ang card: ang 900 pesos kada buwan na finance charge ay sisingilin habang hindi bumababa ang principal. Ito ang tahimik na sugal na hindi mo naririnig dahil walang kumukulit sa iyo tungkol dito.",
          "Ang kamag-anak na 15,000, sa math, ay huli. Pero hindi nangangahulugang hindi ito babayaran. May paraan para maging totoong plano ito, at nasa susunod na mga seksyon iyon."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Mga SSS rule na nagpapabago ng plano",
        "paragraphs": [
          "Ilang detalye sa SSS side na madalas mali ang balita:",
          "Magkano ang tunay na maximum. One-month loan: katumbas ng average ng iyong huling 12 posted Monthly Salary Credits, o hanggang 20,000 pesos. Two-month loan: dobleng iyon, o hanggang 40,000 pesos. Kailangan ng 36 posted contributions para sa one-month at 72 para sa two-month, na may 6 sa huling 12 buwan bago ka mag-apply. Ang kumakalat na 70,000 na maximum ay mali sa ilalim ng kasalukuyang rules: ang formula ay kumukuha lang ng MSC sa ilalim ng Regular Social Security Program, at ayon mismo sa SSS contribution page, ang MSC na lagpas 20,000 hanggang 35,000 ay napupunta sa MySSS Pension Booster (MPF) at hindi binibilang sa salary loan. Kaya 20,000 at 40,000 ang praktikal na ceiling ngayon.",
          "Kung employed ka, hindi ikaw ang nagbabayad. Ang employer ang nagbabawas ng amortization sa payroll, at kung aalis ka sa trabaho, maaaring ibawas ang natitirang balance sa final pay mo. Ibig sabihin: hindi mo kontrolado ang pag-skip nito, na maganda, pero hindi rin ito ang utang na pwede mong dagdagan ng extra peso.",
          "Kung nag-past due ito, lumalala ang presyo. 10 percent kada taon na interest at 1 percent kada buwan na parusa ang nakalista sa Circular 2025-004 coverage, saka haharangan pa ang pag-renew mo. Kaya kung may SSS loan ka na delayed, ang unang gawin ay ayusin ito, kahit hindi ito ang pinakamura sa papel, dahil ang parusa at ang hinarang na renewal ay totoong gastos din."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Kailan unahin ang kamag-anak kahit zero interest",
        "paragraphs": [
          "May dalawang totoong dahilan para ilagay ang kamag-anak sa unahan, at parehong lehitimo:",
          "Una, ang presyo ng relasyon. Ang utang na walang schedule ay ang utang na hindi natatapos. Ang solusyon ay hindi ang pag-ignore, kundi ang pagbibigay dito ng nakasulat na schedule: halimbawa, 1,500 pesos kada kinsenas, tulad ng isang bill na may due date. Ang utang na may schedule ay natatapos; ang utang na \"kapag may extra\" ay hindi.",
          "Pangalawa, ang snowball na panalo. Sa halimbawa natin, ang kamag-anak ang pinakamaliit (15,000). Kung unahin mo ito ng 5,000 kada buwan, mga 3 buwan lang at wala na. Ang presyo ng pag-detour na ito ay mga 2,700 pesos na finance charge ng card sa mga buwang iyon, dahil habang nasa kamag-anak ang extra piso, kumikita pa rin ang 3 percent na singil ng card. Iyon ang totoong halaga ng panalo at ng panatahimik ng pinaka-stressful na creditors mo, at ikaw lang ang makakapagdesisyon kung sulit ito. Ang Goodbye Debt ay may avalanche at snowball toggle para makita mo ang eksaktong pagkakaiba ng dalawang order sa sarili mong numero, hindi sa puro teorya.",
          "Ang hindi pwede ay ang walang desisyon: ang utang na binabayaran \"kung kailan may pera\" ay ang utang na laging nandiyan."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Ang limitasyon ng free tier, sinabi nang tapat",
        "paragraphs": [
          "Ang sitwasyon sa artikulong ito ay tatlong utang, at ang libreng plano ng Goodbye Debt ay tumatakbo ng buong engine sa dalawang utang. Ang libreng plano pa rin ang nagpapakita ng dalawang pinakamahal mong balance, ng avalanche order sa pagitan nila, ng projected debt-free date mo, at ng totoong pagkakaiba ng interest ng isang consistent na order. Kung tatlo o higit pa ang utang mo, ang paid tier ang naka-design para eksakto sa sitwasyong iyon: inaalis ang two-debt limit, may snowball at custom hybrid strategy, at may bulk CSV import para maraming utang ang maipasok nang sabay-sabay.",
          "Isang tapat na paalala din: walang bank linking ang app, kaya mano-mano ang pagpasok ng bawat utang mula sa statement o app ng bawat lender. Deliberate iyon, walang bank credentials sa third-party app, pero ang unang setup ay aabutin ng mga 15 hanggang 20 minuto sa isang tatlong-utang na sitwasyon. Isang beses lang iyon, hindi kada linggo."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Makita ang sarili mong payoff order",
        "paragraphs": [
          "Ipasok ang totoong halaga ng bawat utang, kasama ang totoong interest rate ng bawat isa, at ipapakita ng Goodbye Debt ang ranked order, ang projected debt-free date, at ang perang matitipid mo. Kung gusto mong makita ang pagkakaiba ng \"math muna\" at \"panalo muna\", nandiyan ang avalanche at snowball toggle. Walang bayad bago mo makita ang sarili mong numero."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Mga madalas itanong",
        "paragraphs": [],
        "bullets": null,
        "numbered": null,
        "subheadings": [
          {
            "text": "Kamag-anak muna o credit card?:",
            "paragraphs": [
              "Sa math, credit card muna, dahil 3 percent kada buwan ang singil nito habang ang kamag-anak ay zero. Pero ang kamag-anak ay dapat may nakasulat na schedule at fixed na halaga kada sahod, hindi \"kapag may extra\", dahil ang utang na walang schedule ay hindi natatapos. Kung ang relasyon ang priority mo ngayon, ang snowball order ay totoong opsyon, at ang presyo nito ay makikita sa toggle."
            ]
          },
          {
            "text": "Magkano ang tunay na maximum na SSS salary loan?:",
            "paragraphs": [
              "Hanggang 20,000 pesos sa one-month loan at 40,000 pesos sa two-month loan sa ilalim ng kasalukuyang rules. Ang formula ay gumagamit lang ng MSC sa ilalim ng Regular SS Program na may 20,000 na ceiling; ang kontribusyon sa lagpas 20,000 ay napupunta sa MySSS Pension Booster at hindi binibilang. Kailangan ng 36 posted contributions para sa one-month at 72 para sa two-month."
            ]
          },
          {
            "text": "Ano ang mangyayari kung hindi mabayaran ang SSS salary loan?:",
            "paragraphs": [
              "Dadagdan ito ng 10 percent kada taon na interest at 1 percent kada buwan na parusa ayon sa Circular 2025-004 coverage, haharangan ang pag-renew mo hanggang mabayaran, at kung employed ka, maaaring singilin ang buong balance sa final pay mo kapag umalis ka sa trabaho. Kaya kung delayed ito, unahin ang pag-ayos nito."
            ]
          },
          {
            "text": "Bakit uunahin ang credit card kung zero interest ang utang sa kamag-anak?:",
            "paragraphs": [
              "Dahil ang zero interest na utang ay hindi lumalaki, pero ang 3 percent kada buwan na card ay lumalaki kada buwan na hindi ito nababawasan. Bawat pisong naiwasang singil sa card ay 36 percent kada taon na tipid. Ang kamag-anak ay may ibang presyo, ang relasyon, at iyon ang sinosolusyunan ng nakasulat na schedule, hindi ng paglalagay nito sa unahan ng math."
            ]
          },
          {
            "text": "Kaya ba ng libreng plano ang tatlong utang?:",
            "paragraphs": [
              "Ang libreng plano ay nagpapakita ng dalawang pinakamahal na balance at ng avalanche order sa pagitan nila, kasama ang debt-free date. Sa tatlong utang pataas, ang paid tier ang tugma: walang two-debt limit, may snowball at custom hybrid, at may bulk CSV import. Parehong may manual entry, walang bank linking."
            ]
          }
        ]
      }
    ],
    "faq": [],
    "ctaLead": "See your own payoff order, free",
    "ctaSub": "Add your real debts and see your avalanche-ordered plan, your projected debt-free date, and the interest you would save. No bank linking, manual entry or a CSV, and nothing to pay before you see the numbers."
  },
  {
    "slug": "home-credit-sss-credit-card-plano",
    "title": "Home Credit, SSS Loan, at Credit Card Utang: Paano Gumawa ng Isang Plano",
    "description": "Home Credit cash loan, SSS salary loan, at credit card utang: ang totoong effective na presyo ng bawat isa, ang tamang payoff order, at ang Home Credit late ladder.",
    "kicker": "Home Credit, SSS, at card",
    "tldr": "I-convert muna ang tatlong utang sa iisang yunit, ang effective na halaga kada buwan, bago magdesisyon. Sa halimbawa sa ibaba: credit card muna (3 percent kada buwan), Home Credit pangalawa (2.91 percent effective sa ginamit na offer), SSS salary loan kahuli-hulihan (mga 0.67 percent). Pero hindi fixed ang order: sa average na Home Credit offer na 3.89 percent effective, pwede itong umaakyat sa unahan.",
    "sections": [
      {
        "heading": "Bakit magkaiba ang hugis ng tatlong utang",
        "paragraphs": [
          "Hindi lang ang interest ang pinagkaiba ng tatlong ito. Iba rin ang hugis ng kada isa, at ang hugis ang nagdedetermina kung ano ang kaya mong kontrolin.",
          "Ang Home Credit cash loan ay fixed na installment: isang halaga kada buwan, pare-pareho, hanggang matapos ang term. Hindi mo ito pwedeng bawasan ng pansamantala kapag masikip ang buwan, at hindi rin ito lumalaki habang current ka. Ang kapalit ng katiyakan: hindi rin ito pwedeng pahintuin nang walang kasunod na parusa, at makikita mo sa ibaba kung gaano kalaki ang mga parusang iyon.",
          "Ang SSS salary loan, kung employed ka, ay ibinabawas mismo sa sahod mo. Hindi ikaw ang gumagawa ng bayad kada buwan, kaya hindi rin ito ang utang na pwede mong dagdagan ng extra piso. Ang kontrol mo dito ay nasa unahan: sa pag-apply at sa pag-iwas sa past due.",
          "Ang credit card ang kabaligtaran ng Home Credit: revolving ito. Kaya mong bayaran ang buo at walang interest, o i-revolve at magdala ng 3 percent kada buwan na finance charge. Ito ang utang na kaya mong gawing maliit o gagawing laki, kaya nasa iyo ang desisyon, at kaya nito sirain ang plano kapag iniwan lang sa minimum."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Ang tunay na halaga ng bawat utang",
        "paragraphs": [
          "Ang credit card: 3 percent kada buwan, at hindi teoretikal iyon. Sa ilalim ng BSP Circular 1165 (s. 2023), ang finance charge ng credit card ay may cap na 3 percent kada buwan, o 36 percent kada taon. Sa 141 na Philippine card na may published rate, 139 ang siningil sa buong 3 percent. Sa 30,000 na balance, mga 900 pesos kada buwan ang finance charge. At ang mas mapanira pa: sa 50,000 na balance, mga 1,500 pesos kada buwan ang singil habang ang karaniwang minimum na 1,250 ay kulang dito, kaya lumalaki ang utang kahit nagbabayad ka ng minimum.",
          "Ang Home Credit cash loan: maliit ang nakalagay na rate, pero may kasamang iba. Ang sariling Table of Fees and Charges ng Home Credit (updated as of October 2025) ay naglalista ng nominal interest rate na 1.49 hanggang 8.99 percent kada buwan, depende sa offer sa iyo, at isang average na 3.89 percent kada buwan na effective interest rate sa kabuuan. Ang unahan ng 1.49 ay ang pinakamababang offer, hindi ang karaniwan. May processing fee din na hanggang 500 pesos na ibabawas mismo sa proceeds, kaya ang 20,000 na loan ay mga 19,500 lang ang dating sa iyo. At may mga conditional charges na maaaring makasabit sa account: Loan Extra Care fee na hanggang 99 pesos kada buwan at Borrower Protection na hanggang 500 pesos kada buwan, depende sa mga produktong nakadugtong sa loan mo.",
          "Ang SSS salary loan: ang pinakamura sa tatlo. 8 percent kada taon sa diminishing balance, 24 na buwanang installment, at may 1 percent na service fee na ibabawas sa proceeds. Ang maximum na one-month loan na 20,000 pesos ay mga 904.55 kada buwan sa loob ng 24 buwan, kabuuang mga 21,709, kaya mga 1,709 lang ang buong interest. I-convert sa buwanan, mga 0.67 percent kada buwan iyan bago pa ang kaunting epekto ng service fee. Kumpara sa 900 pesos kada buwan na finance charge ng 30,000 card, malayo ang agwat."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Ang rule: parehong yunit bago mag-rank",
        "paragraphs": [
          "Ang tatlong utang ay naka-price sa magkaibang paraan: ang card ay kada buwan sa outstanding balance, ang Home Credit ay fixed installment na may kasamang fees, ang SSS ay taunang rate na binabawas sa sahod. Hindi sila diretso magkatapat, kaya i-convert muna:",
          "Ang overlap ang mahalagang kitaan: ang pinakamurang Home Credit offer ay mas mura pa sa card, pero ang average na offer na 3.89 percent effective ay mas mahal na. Kaya hindi pwede ang hula: ang offer screen mo mismo, o ang Loan Disclosure Statement mo, ang nagsasabi kung alin sa dalawa ang mas mahal sa iyo. Ang SSS, sa lahat ng makatotohanang senaryo, ay huli sa ranking.",
          "Pagkatapos ng conversion, ang rule ay iisa: bayaran ang minimum ng lahat para walang maging past due, at ang bawat sobrang piso ay ipadala sa tuktok. Kapag natapos ang una, lumilipat ang pondo sa susunod, hanggang matapos. Ito ang avalanche order."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null,
        "table": {
          "headers": [
            "Utang",
            "Presyo",
            "Effective kada buwan"
          ],
          "rows": [
            [
              "Credit card",
              "3 percent kada buwan na finance charge (BSP cap)",
              "3 percent, bago pa ang mga fee"
            ],
            [
              "Home Credit cash loan",
              "1.49 hanggang 8.99 percent nominal, depende sa offer",
              "mga 2.9 hanggang 3.9 percent sa tipikal na offer, kasama ang processing fee"
            ],
            [
              "SSS salary loan",
              "8 percent kada taon, diminishing",
              "mga 0.67 percent"
            ]
          ]
        }
      },
      {
        "heading": "Worked example: 30,000 card, 20,000 Home Credit, 20,000 SSS",
        "paragraphs": [
          "Ilagay natin sa isang totoong sitwasyon: 30,000 na credit card balance, 20,000 na natitira sa Home Credit cash loan, at 20,000 na SSS salary loan na binabawas sa sahod.",
          "Ang SSS ay nagbabayad sa sarili nito sa payroll deduction, kaya wala ito sa tunay na laban. Ang laban ay card laban Home Credit.",
          "Sa Home Credit na 20,000 sa 12 buwan sa 2.49 percent na nominal rate: mga 1,948.56 kada buwan, kabuuang mga 23,383, kaya mga 3,383 ang interest sa buong term. Idagdag ang 500 na processing fee na ibabawas sa proceeds at ang effective na halaga ay umaakyat sa mga 2.91 percent kada buwan. Sa kabilang panig, ang card na 30,000: kung 2,000 pesos kada buwan ang ilalagay mo, aabutin ito ng mga 21 na buwan at mga 10,456 pesos na interest sa 3 percent kada buwan na singil.",
          "Dito lumalabas ang desisyon: sa halimbawang ito, ang extra piso ay napupunta sa card, dahil 3 percent ito laban sa 2.91 percent effective ng Home Credit offer. Pero ang agwat ay halos wala. Kung ang offer na natanggap mo ay nasa average na 3.89 percent effective, babaliktad ang order: Home Credit muna, card pangalawa. Ang parehong piso sa SSS ay nagtitipid lang ng 8 percent kada taon, kaya huli ito sa lahat ng senaryo.",
          "May isa pang dahilan kung bakit delikado ang card na iwanan sa dulo: ang minimum na 1,250 sa 50,000 na balance ay hindi man lang natatakpan ng 1,500 na finance charge. Ang Home Credit na current ka ay hindi lumalaki; ang card na minimum lang ang binabayaran ay lumalaki kada buwan."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Mga Home Credit rule na nagpapabago ng plano",
        "paragraphs": [
          "Ang processing fee ay hindi dagdag sa utang, kural ito sa matatanggap mo. Hanggang 500 pesos, ibinabawas sa proceeds bago pa ito dumating sa iyo. Kaya ang totoong halaga ng loan ay hindi ang nakasulat na principal, kundi ang principal minus fee versus ang kabuuang binabayaran mo.",
          "May bayad ang pag-bago ng isip. Full o partial early repayment: 300 pesos. Change due date: 300 pesos. Kung plano mong bayaran nang maaga, isama ang 300 sa computation; kahit may fee, ang matitipid na interest sa maagang pagsara ay karaniwang mas malaki pa rin.",
          "Ang late ladder ay mabigat, at nagtatapos sa 40 percent. Ayon sa sariling disclosure table ng Home Credit: 5 araw na hindi pagbayad, hanggang 300 pesos; 30 araw, hanggang 700; 60 araw, hanggang 1,000; sa 90 araw na hindi pagbayad, termination fee na 40 percent ng outstanding principal; at bawat 120 araw hanggang 270 araw, dagdag na 2 percent ng outstanding principal. May 5,000 pesos pang attorney fee sa dulo. Ang mga \"hanggang\" na salita ay mahalaga, pero ang hugis ng ladder ay totoo: ang default na ito ay mas mabigat kaysa 1 percent kada buwan na parusa ng SSS loan.",
          "Hindi pwedeng i-pause ang installment. Walang \"next month na lang\" na opsyon na walang kasamang parusa mula sa ladder sa itaas. Kaya kung napipinto ang kagipitan, ang card at ang kamag-anak ay mas pwedeng paggalawan pansamantala kaysa Home Credit, at iyan ay dapat isaalang-alang sa pagpapili ng order, hindi lang ang interest."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Mga SSS rule, maikli lang",
        "paragraphs": [
          "Tatlo lang ang kailangan mong tandaan dito, dahil may kumpletong artikulo na para sa SSS side. Una, kung employed ka, ang employer ang nagbabawas, kaya hindi mo ito kontrolado kada buwan. Pangalawa, ang tunay na maximum ngayon ay 20,000 sa one-month loan at 40,000 sa two-month, dahil ang formula ay kumukuha lang ng Monthly Salary Credit sa ilalim ng Regular SS Program na may 20,000 na ceiling; ang kumakalat na 70,000 ay mali. Pangatlo, kapag nag-past due ito, may 10 percent kada taon na interest at 1 percent kada buwan na parusa, at haharangan pa ang pag-renew mo. Kung may SSS loan kang delayed, ayusin muna iyon kahit hindi ito ang pinakamura sa papel."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Kailan unahin ang Home Credit kahit installment na nga ito",
        "paragraphs": [
          "Dalawang sitwasyon ang naglalagay sa Home Credit sa unahan kahit fixed installment ito.",
          "Una, kung ang offer mo ay nasa average o mas mataas: 3.89 percent effective ay lumalagpas na sa 3 percent na cap ng card, at wala pang kasamang dagdag na fees ng card tulad ng cash advance fee o annual fee. Pangalawa, kung ang card mo ay nasa minimum-payment trap: ang balance na lumalaki kahit nagbabayad ka ay mas mapanira kaysa fixed installment na hindi lumalaki habang current ka. Sa ganyang sitwasyon, ang pagpapatahimik muna sa card ay pagtatanggol, hindi pagpapabinata ng plano.",
          "Ang hindi pwede ay ang paglapag ng Home Credit sa dulo dahil lang may fixed at komportableng halaga ito kada buwan. Ang komportableng utang ay hindi laging ang murang utang."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Ang limitasyon ng free tier, sinabi nang tapat",
        "paragraphs": [
          "Tatlong utang ang sitwasyon ng artikulong ito, at ang libreng plano ng Goodbye Debt ay tumatakbo ng buong engine sa dalawang utang. Ang libreng plano pa rin ang nagpapakita ng dalawang pinakamahal mong balance, ng avalanche order sa pagitan nila, ng projected debt-free date mo, at ng pagkakaiba ng interest ng isang consistent na order. Sa tatlong utang pataas, ang paid tier ang tugma: walang two-debt limit, may snowball at custom hybrid strategy, at may bulk CSV import.",
          "Tapat na paalala din: walang bank linking ang app, kaya mano-mano ang pagpasok ng bawat utang mula sa statement o offer screen ng bawat lender. Sa tatlong-utang na sitwasyon, mga 15 hanggang 20 minuto ang unang setup. Isang beses lang iyon."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Makita ang sarili mong payoff order",
        "paragraphs": [
          "Ipasok ang totoong halaga, totoong rate, at totoong buwanang bayad ng bawat utang, at ipapakita ng Goodbye Debt ang ranked order, ang projected debt-free date, at ang perang matitipid mo. Kung gusto mong makita ang dalawang order na magkatabi, nandiyan ang avalanche at snowball toggle. Walang bayad bago mo makita ang sarili mong numero."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "Mga madalas itanong",
        "paragraphs": [],
        "bullets": null,
        "numbered": null,
        "subheadings": [
          {
            "text": "Alin ang unahin: Home Credit o credit card?:",
            "paragraphs": [
              "I-depende sa effective na halaga ng dalawa, hindi sa hugis. Kalkulahin ang Home Credit offer mo kasama ang processing fee: kung nasa 2.9 percent effective ito, mukhang ang card ang unahin dahil 3 percent ito; kung nasa 3.9 percent, Home Credit muna. Ang SSS ay laging huli sa math. Ang card na nasa minimum-payment trap lamang ang ekssepsyon: unahin ito dahil lumalaki ito kahit nagbabayad ka."
            ]
          },
          {
            "text": "Bakit mataas ang effective ng Home Credit kahit maliit ang nakalagay na rate?:",
            "paragraphs": [
              "Dahil ang nakalagay na rate ay nominal at per offer, habang ang totoong presyo ay may kasamang processing fee na ibinabawas sa proceeds at mga conditional charges na maaaring makasabit sa account. Ang sariling disclosure ng Home Credit ang nagsasabi ng average: 3.89 percent kada buwan na effective. Kaya ang 1.49 na nakikita mo ay hindi ang binabayaran mo kada buwan sa kabuuan."
            ]
          },
          {
            "text": "Ano ang mangyayari kung hindi mabayaran ang Home Credit cash loan?:",
            "paragraphs": [
              "Sumusunod ito sa late ladder ng disclosure table nila: hanggang 300 pesos sa 5 araw, hanggang 700 sa 30 araw, hanggang 1,000 sa 60 araw, at termination fee na 40 percent ng outstanding principal sa 90 araw, na may dagdag na 2 percent bawat 120 araw hanggang 270 araw at 5,000 na attorney fee. Kaya kung alam mong may masisiraang buwan, kausapin sila bago pa tumama ang unang parusa, at ilayo ang plano sa ladder na iyan."
            ]
          },
          {
            "text": "Pwede ba bayaran nang maaga ang Home Credit cash loan?:",
            "paragraphs": [
              "Pwede, full o partial, sa 300 pesos na fee bawat request. Sa karamihan ng kaso, ang matitipid na interest sa maagang pagsara ay mas malaki pa rin kaysa 300, kaya kalkulahin ang dalawa bago magdesisyon. Ang bayad na ito ay isa sa mga dahilan kung bakit dapat totoong binabasa ang offer screen bago ang loan, hindi pagkatapos."
            ]
          },
          {
            "text": "Kaya ba ng libreng plano ang tatlong utang?:",
            "paragraphs": [
              "Ang libreng plano ay nagpapakita ng dalawang pinakamahal na balance at ng avalanche order sa pagitan nila, kasama ang debt-free date. Sa tatlong utang pataas, ang paid tier ang tugma: walang two-debt limit, may snowball at custom hybrid, at may bulk CSV import. Parehong may manual entry at walang bank linking."
            ]
          }
        ]
      }
    ],
    "faq": [],
    "ctaLead": "See your own payoff order, free",
    "ctaSub": "Add your real debts and see your avalanche-ordered plan, your projected debt-free date, and the interest you would save. No bank linking, manual entry or a CSV, and nothing to pay before you see the numbers."
  },
  {
    "slug": "goodbye-debt-is-live",
    "title": "Goodbye Debt Is Live: Start Your Payoff Plan in 20 Minutes",
    "description": "Goodbye Debt is live. Add every debt, see your avalanche and snowball payoff orders with real debt-free dates, and keep unlimited tracking free forever as a founding member.",
    "kicker": "We are live",
    "tldr": "Goodbye Debt is now open to everyone. Add every debt you carry, and the calculator ranks them by real cost, shows your avalanche and snowball orders side by side, and projects your debt-free date. The first 100 people to join keep unlimited debt tracking free forever. Setup takes about twenty minutes.",
    "sections": [
      {
        "heading": "What launched, exactly",
        "paragraphs": [
          "Goodbye Debt started as a spreadsheet problem. Every debt payoff article says the same thing, rank your debts and pay them in order, and then leaves you alone with a calculator, a notebook, and six different apps that each show you one piece of the picture. The app that just launched is the thing we wished existed when we were doing it by hand: you enter every debt once, and the payoff plan maintains itself from that day forward.",
          "Here is what is in the box on day one:",
          "None of this required a bank connection, which was a deliberate choice we will come back to below."
        ],
        "bullets": [
          "A payoff calculator that takes every debt you carry, its balance, and its actual monthly interest rate, and builds your plan from the real numbers instead of from memory.",
          "Avalanche and snowball side by side. You see the payoff order each method produces, the projected debt-free date for each, and the total interest each one costs you. No debating the methods in the abstract, you just look at what your own numbers say.",
          "A payments log. Every payment you record updates your progress percentage, recalculates the plan, and moves your debt-free date. When you pay off an account, it closes out of the plan and the extra money rolls forward automatically.",
          "Debt Slayers, the community. Private by default, ranked by percentage paid off rather than peso amounts, so someone clearing 20,000 pesos of utang stands next to someone clearing 50,000 dollars of cards, and both are just people hitting their numbers.",
          "Install it as an app. On a phone or desktop you can add Goodbye Debt to your home screen and it runs like a native app, including offline, because a payoff plan you cannot open at the bank line is a plan you will stop updating."
        ],
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "What the calculator does with your numbers",
        "paragraphs": [
          "The core of the app is the same math from our guide on which debt to pay off first, but running on your accounts instead of examples.",
          "You enter each debt with three things: a name, the current balance, and the interest rate as a monthly rate. That last detail matters in the Philippines specifically. Credit cards here quote a monthly rate on the unpaid balance, commonly up to 3 percent a month under the BSP cap. Lending apps like Tala publish effective monthly rates in the 11 to 12 percent range. Government loans sit under 1 percent a month. When your plan is built on monthly rates, the ranking between a GCredit balance and an SSS salary loan is obvious in a way that annual-rate comparisons constantly hide.",
          "Once your debts are in, the calculator produces three things you can act on immediately:",
          "If the two methods disagree on your numbers, you will see exactly how much the disagreement is worth in pesos. Sometimes it is hundreds of pesos. On app-loan-heavy stacks it can be more than ten times that. Either way you decide with the figure in front of you, and you can switch methods whenever life changes, because the plan is a live calculation, not a document."
        ],
        "bullets": null,
        "numbered": [
          "Your payoff order. Avalanche (highest monthly rate first) and snowball (smallest balance first) each get their own ordered list, and each debt shows what it is costing you per month while it waits in line.",
          "Your projected debt-free date. Both methods get one, based on what you can put toward debt every month above the minimums.",
          "Your savings line. The total interest each method would charge you between now and zero, so the cost of picking the comfortable order instead of the cheap order is a number, not a feeling."
        ],
        "subheadings": null
      },
      {
        "heading": "Your first twenty minutes, step by step",
        "paragraphs": [
          "Signing up takes an email and a password. No card details, no bank linking, no application. After that, here is the setup sequence that gets you to a real plan:",
          "From there the maintenance cost is one minute per payment. That is the entire ongoing workload of a Goodbye Debt plan, and it is the reason the notebook method falls apart around month three while this does not."
        ],
        "bullets": null,
        "numbered": [
          "Gather your statements. One statement or app screen per debt is enough. You need three figures from each: the current balance, the monthly interest rate, and the minimum payment. If a lender only quotes an annual rate, divide it by 12 for an estimate and correct it later from the statement.",
          "Add each debt. Name it the way you think about it, \"BDO card\" beats a fourteen-digit account number, and enter the balance, the monthly rate, and the minimum. The free plan runs the full engine on up to two debts, which is enough to see exactly how the calculator behaves before you commit an evening to data entry.",
          "Set your monthly amount. This is the money you can put toward all debts combined, minimums included. The calculator spreads it in your chosen order and everything downstream, dates, savings, payoff order, flows from this one figure. Honest in, honest out.",
          "Read the two plans. Look at the avalanche date and the snowball date, then the interest lines under each. Pick the one you will actually follow. The mathematically cheapest plan you abandon in month two is more expensive than the slightly pricier plan you stick to for two years.",
          "Log your first payment. Even if it is this month's minimums, record it. Your progress percentage starts moving and the plan starts recalculating, which is the habit that carries the whole thing."
        ],
        "subheadings": null
      },
      {
        "heading": "Why the first 100 members keep it free forever",
        "paragraphs": [
          "The app is freemium. The free plan runs the complete prioritization engine on up to two debts with no card required. Beyond two debts, every strategy mode, and CSV import, a paid tier applies.",
          "The first 100 people to create an account skip that entirely. Founding members get unlimited debt tracking free forever, no upgrade, no expiration, regardless of what the paid tier costs later. The counter on the homepage always shows how many founding seats are left, and there is no waiting list and no referral trick behind it. When the counter hits zero, it hits zero.",
          "Why run it this way? Because a payoff tool is only useful if it is still around in the year your plan takes to finish, and the founding model is how a small product pays for staying alive without charging the people who took a chance on it first. You are not user forty thousand to us. You are one of the hundred the whole thing was built with."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "What your data looks like on our side",
        "paragraphs": [
          "The design rule is that your paperwork stays yours.",
          "Statements and screenshots are read in your browser. When you use the statement import, the PDF or photo is processed on your device and only the figures you confirm, a balance, a rate, a minimum, are saved. The file itself never uploads.",
          "Your debts are visible to you alone. Accounts are isolated at the database level, your data is encrypted in transit and at rest, and there is no shared or staff-side view of what you owe.",
          "The community never sees amounts. A Debt Slayers profile is private by default. If you opt in, what becomes public is your display name, your country, your story if you write one, and your percentage paid off. Never your balances, never your lender names, never your payment history. You can switch it off any time and the leaderboard updates within a day."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "What Goodbye Debt will not do for you",
        "paragraphs": [
          "It is worth being plain about the edges of the tool, because trust compounds and overpromising spends it.",
          "Goodbye Debt does not negotiate with lenders. It cannot settle a debt, lower a rate, or stop collection calls. If you need a restructuring conversation with a bank, that conversation is yours to have, and the calculator's job is to make sure you walk into it knowing exactly what the debt costs you per month.",
          "It is not a lender and does not refer you to one. There is no loan product behind the app and no lead-selling arrangement behind the free plan. The business model is a subscription for people with more than two debts, not brokering your data to finance companies.",
          "It is not licensed financial advice. The math is standard debt payoff arithmetic, avalanche and snowball, applied to your inputs. For situations involving foreclosure risk, bankruptcy, or legal action, the right move is a licensed counselor or attorney, and the app will still be here doing the arithmetic when that is sorted."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      }
    ],
    "faq": [
      {
        "q": "Is it really free?",
        "a": "The free plan runs the full prioritization engine on up to two debts, no card required and no trial clock. The first 100 accounts, the founding members, get unlimited debt tracking free forever. The paid tier only comes into play for more than two debts, every strategy mode, and CSV import, and founding members never see it."
      },
      {
        "q": "What happens when the 100 founding seats run out?",
        "a": "New signups after that get the free two-debt plan and can upgrade to the paid tier when they need more. Founding members keep everything they have at no cost, permanently. The homepage counter is the live source of truth for seats remaining."
      },
      {
        "q": "Does it work outside the Philippines?",
        "a": "Yes. Enter debts in whatever currency you carry them, pesos, dollars, pounds, and the engine works the same, because percentage math does not care where you live. The community leaderboard already has slayers from the Philippines, the United States, and the United Kingdom, ranked by percent paid off so the comparison is fair across currencies."
      },
      {
        "q": "Do I have to connect my bank account?",
        "a": "No. There is no bank linking anywhere in the app, by design. You enter debts by hand from your statements, or read a statement PDF or photo in your browser and confirm the figures it finds. On the paid tier you can import a CSV instead. Nothing in the app ever asks for your bank credentials."
      },
      {
        "q": "What if I only know my interest rate as an annual number?",
        "a": "Use the monthly rate printed on your statement when it shows one, which credit cards in the Philippines always do. If a lender only quotes annual, dividing by 12 gives a workable estimate, and you can refine it the next time the statement arrives. The ranking between debts rarely flips over a small estimate error, and the plan recalculates whenever you correct a figure."
      }
    ],
    "ctaLead": "Claim a founding seat, free forever",
    "ctaSub": "The first 100 members get unlimited debt tracking free forever, no upgrade and no expiration. Add your debts, see both payoff plans with real dates, and start your progress percentage tonight."
  },
  {
    "slug": "pagibig-billease-bank-loan",
    "title": "Pag-IBIG Loan Plus BillEase Plus a Bank Loan: One Payoff Plan",
    "description": "Pag-IBIG MPL, BillEase, and a bank personal loan in one payoff plan: the real converted rates, a worked three-loan example, and the order that saves the most interest.",
    "kicker": "Pag-IBIG, BillEase, at bank loan",
    "tldr": "Put all three on one unit first, the effective monthly cost. In the worked example below the order is BillEase at 3.49 percent a month, then the Pag-IBIG MPL at 1.4583 percent a month on a diminishing balance, about 17.5 percent a year, then the bank loan at 15 percent a year. A bank loan at 17.5 percent or higher flips the last two.",
    "sections": [
      {
        "heading": "The trap: a government loan is not automatically the cheapest money",
        "paragraphs": [
          "The instinct says the government loan goes last because government money is always the cheapest. For the Pag-IBIG Multi-Purpose Loan that instinct is wrong, and it is wrong by a measurable margin.",
          "The MPL is published as a 10.5 percent a year rate. The number that actually gets charged is different: Pag-IBIG's own application form (HQP-SLF-065, current version dated 10/2026) states the loan carries interest of 1.4583 percent per month, including the grace period, based on a diminishing balance method. Run that monthly figure forward and it lands at about 17.5 percent a year, which is the equivalence Pag-IBIG has published on this loan for years: 10.5 percent per annum, equivalent to 17.5 percent on a diminishing balance.",
          "Now put that next to the other two legs. A bank personal loan in the Philippines typically runs 14 to 18 percent a year. That means a Pag-IBIG MPL sits inside the bank loan range, not below it. At 14 percent the bank loan is cheaper than the MPL. At 18 percent the MPL is cheaper. And BillEase, at 3.49 percent a month, is more expensive than both by a wide margin, about 51 percent a year effective once the monthly charge compounds.",
          "The genuinely cheap government money is elsewhere. An SSS salary loan runs 8 percent a year. A Pag-IBIG Calamity Loan, when your area has a declared state of calamity, is being announced at 5.95 percent a year, roughly a third of the MPL's cost. The MPL is a flexible, useful loan, but a cheap one it is not.",
          "So the ranking for these three is not \"government first\" or \"bank last\". It is a conversion problem, and the conversion is four lines of arithmetic."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The real price of each of the three debts",
        "paragraphs": [
          "Pag-IBIG Multi-Purpose Loan. You borrow against your own savings, up to 90 percent of your Total Accumulated Value, subject to the lowest of three tests: the amount you asked for, your entitlement, and capacity to pay, which means the amortization cannot push your net take-home pay below the floor set by the General Appropriations Act or your company policy. Terms run one, two, or three years. There is a two month grace period before the first payment, but the form is explicit that interest runs during the grace period, so the loan is not free while it waits. Amortization is normally taken straight from your salary through your employer, which is the structural detail that changes how you run the payoff plan below. Miss a payment and the penalty is 1/20 of 1 percent of the unpaid amount for every day of delay, about 1.5 percent a month, higher than the loan's own monthly interest. The Calamity Loan is a separate program on the same savings base, up to 80 percent of Total Accumulated Value, at the lower 5.95 percent rate when a calamity window is open.",
          "BillEase. A standard cash loan or buy-now-pay-later plan runs 3.49 percent a month on the declining balance, with an EasyPace option up to 24 months at 4.16 percent a month. There is a 0 percent offer at select partner merchants, and it is real, but it is conditional: the balance has to be cleared inside the grace structure, commonly 3 or 6 months, and if it is not, the standard 3.49 percent applies retroactively from the first installment. Read that last clause twice before you count on the 0 percent headline.",
          "Bank personal loan. Commonly 14 to 18 percent a year, charged monthly on the declining balance, so about 1.17 to 1.5 percent a month. It requires a credit check and an application, and banks weigh your existing obligations, so qualification is a live condition, not a formality. The upside of the product is a fixed amortization with a defined end date, which is exactly what a revolving balance never has."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The rule: one unit before any ranking",
        "paragraphs": [
          "The three debts quote themselves differently. The MPL quotes a monthly rate on a diminishing balance. BillEase quotes a monthly rate. The bank quotes an annual rate. Before anything gets ranked, convert everything to the effective monthly cost on the outstanding balance.",
          "Here is what one peso of balance costs over a single year on each of them:",
          "The table is the whole method. Every extra peso earns the most by going to the row with the highest annual cost. Most people carry some version of this mix and rank it by which lender sounds most official or which bill arrived most recently, and that habit is expensive in exactly the rows where the numbers are furthest apart."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null,
        "table": {
          "headers": [
            "Debt",
            "Quoted as",
            "About this much a year per 1,000 pesos"
          ],
          "rows": [
            [
              "BillEase standard",
              "3.49 percent a month",
              "About 509 pesos"
            ],
            [
              "Bank personal loan",
              "18 percent a year",
              "About 180 pesos"
            ],
            [
              "Pag-IBIG Multi-Purpose Loan",
              "10.5 percent a year, 1.4583 percent a month diminishing",
              "About 175 pesos"
            ],
            [
              "Bank personal loan",
              "15 percent a year",
              "About 150 pesos"
            ],
            [
              "Bank personal loan",
              "14 percent a year",
              "About 140 pesos"
            ],
            [
              "SSS salary loan",
              "8 percent a year",
              "About 80 pesos"
            ],
            [
              "Pag-IBIG Calamity Loan",
              "5.95 percent a year",
              "About 60 pesos"
            ]
          ]
        }
      },
      {
        "heading": "Worked example: 100,000 MPL, 20,000 BillEase, 120,000 bank loan",
        "paragraphs": [
          "Three debts: a 100,000 peso Pag-IBIG MPL on the two year term at 1.4583 percent a month, a 20,000 peso BillEase balance at 3.49 percent a month, and a 120,000 peso bank personal loan at 15 percent a year over three years.",
          "Run each one on its own schedule first. The MPL amortizes at about 4,968 pesos a month, and the total interest across the two years is about 19,240 pesos. The bank loan amortizes at about 4,160 pesos a month, with total interest of about 29,750 pesos across its three years. The BillEase balance, paid at 2,500 pesos a month with no extra money, clears in about 10 months and costs roughly 3,870 pesos in interest over that span. Minimum payments across all three are about 11,628 pesos a month.",
          "Now add 1,000 pesos a month of extra money and run the plan twice, once in the converted order and once with the extra peso sent to the bank loan first, which is the order instinct tends to pick:",
          "Read that honestly, including the part that tempers the usual avalanche sermon. On this specific mix the order is worth about 1,650 pesos against the instinct order and about 1,300 pesos against an even split, real money, but not a transformation. The reason is that BillEase carries the highest rate but the smallest balance, so the amount of money sitting at 3.49 percent is limited. The order becomes decisive when the expensive balance is the big one, which is the common case for someone with a large app loan or a revolving card balance.",
          "The second reading is the more useful one. The 1,000 pesos is not doing the same work against each balance. At BillEase it avoids about 509 pesos a year in interest, at the MPL about 175, at the bank loan 150 at a 15 percent rate. That is where the flip lives: if your own bank loan is priced at 17.5 percent a year or higher, it costs more per peso than the MPL, and the order becomes BillEase, then the bank loan, then the MPL. At 14 or 15 percent, the MPL is the one that waits. Nothing about the lenders changed; only the numbers you were actually quoted."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null,
        "table": {
          "headers": [
            "Order of the extra 1,000 a month",
            "Months to clear all three",
            "Total interest"
          ],
          "rows": [
            [
              "BillEase, then MPL, then bank loan",
              "About 22",
              "About 39,960 pesos"
            ],
            [
              "MPL, then BillEase, then bank loan",
              "About 22",
              "About 40,720 pesos"
            ],
            [
              "Bank loan, then MPL, then BillEase",
              "About 22",
              "About 41,610 pesos"
            ],
            [
              "Split evenly across all three",
              "About 23",
              "About 41,280 pesos"
            ]
          ]
        }
      },
      {
        "heading": "The Pag-IBIG rules that change the plan",
        "paragraphs": [
          "The payment mostly comes out of your salary, and you do not steer it monthly. The amortization is remitted through your employer. That means the MPL is not the loan you feed extra pesos into, even when its rate justifies attention: your room to move is on the BillEase and bank loan side. Run the plan accordingly. The MPL pays itself on schedule, and the extra money goes where you can actually direct it.",
          "The grace period is not free. Interest runs at 1.4583 percent a month during the two month grace, so the balance is not standing still before the first payment. Budget for the full amortization from the start rather than treating the grace period as money saved.",
          "The late penalty outruns the loan. 1/20 of 1 percent per day of delay is about 1.5 percent a month on the unpaid amount, more than the loan's own monthly rate. Skipping the MPL to fund a higher-rate balance is a losing trade the moment it becomes habitual, because penalties at that rate can put the MPL back at the top of the ranking.",
          "The aggregate cap shapes what you can borrow. MPL and Calamity Loan are separate programs and you can hold both, but combined short-term loans cannot exceed 90 percent of your Total Accumulated Value, and the loanable amount is reduced by any existing MPL, Calamity Loan, or HELPs balance. That matters for planning: if you are already borrowing against savings, the next loan you qualify for may be smaller than the headline suggests.",
          "The Calamity Loan is the version of this money worth waiting for. Same savings base, 5.95 percent a year when a calamity window is declared for your area, and it can run 24 or 36 months. If you have an MPL at 1.4583 percent a month and your area opens a calamity window, the honest arithmetic says the cheaper program is worth the paperwork."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "The BillEase and bank rules that change the plan",
        "paragraphs": [
          "On BillEase, the 0 percent offer is a deadline, not a discount. It works only if the full balance clears inside the grace structure, and the standard 3.49 percent applies retroactively from the first installment if it does not. If you are unsure whether your cash flow can clear it in the window, the standard plan's flat, predictable rate is easier to plan around than a 0 percent offer that can revert to worse terms than the standard plan.",
          "On BillEase, the longer term is not the cheaper term. EasyPace at 4.16 percent over up to 24 months lowers the monthly bite and raises the total interest. Both facts are true at once, and which one matters depends on whether the constraint this month is cash flow or total cost.",
          "On the bank loan, qualification is the binding condition. The rate only exists if you are approved at it. If your existing obligations already crowd your income, the honest answer may be restructuring the card side rather than a new loan, and the restructuring conversation with your issuer costs nothing to have. This decision has a full walkthrough in the personal loan guide on this site, and the three conditions it sets (rate clearly below what you are replacing, real qualification at that rate, and the replaced balance staying at zero afterward) apply just as much when the thing being replaced is a BillEase balance.",
          "On the bank loan, a fixed end date is the product's real feature. Against the MPL the rate gap is a few tenths of a point in either direction depending on what you are quoted; against BillEase the gap is enormous. What the loan adds beyond rate is a schedule that ends, which a BNPL balance on a rolling top-up never has."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "How to run all three in one plan",
        "paragraphs": [
          "Pay the minimum on all three every month. This is not optional and it is not the place to be clever: the MPL's penalty rate and the bank loan's late fees both make a missed minimum more expensive than any ordering gain from the money you were late with.",
          "Then send every remaining peso to the highest row in the converted table, which in most versions of this mix is BillEase, followed by whichever of the MPL and the bank loan carries the higher real cost. When the top balance clears, its whole payment rolls to the next one, not back into spending. In the worked example that is what turns the 2,500 pesos BillEase was absorbing into accelerated progress on the MPL and the bank loan, and it is the step people most often skip.",
          "Two rules override the ranking. Never let the MPL go past due, because its daily penalty is the most expensive money in the plan. And never let a cleared BNPL balance refill, because a plan that reopens a paid balance has not made progress, it has just rearranged it.",
          "The free Goodbye Debt plan runs the full engine on up to two debts, forever, no bank linking, manual entry or a CSV import. Three debts and up is where the paid tier comes in: no two-debt limit, a snowball order and a custom hybrid alongside the avalanche, and bulk CSV import. In this mix that is the difference between ranking two of the three and seeing the real order across all of them."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      },
      {
        "heading": "See your own order in two minutes",
        "paragraphs": [
          "The three loans in this article are placeholders for the three you actually hold. Enter your own balance and monthly rate for each, and the plan reports the order, the projected debt-free date, and the interest difference between the converted order and the one instinct picks. Manual entry or a CSV import, no bank linking, and nothing to pay before you see the numbers."
        ],
        "bullets": null,
        "numbered": null,
        "subheadings": null
      }
    ],
    "faq": [
      {
        "q": "Which of the three debts should I pay first?",
        "a": "The one with the highest effective monthly cost, which in most versions of this mix is BillEase at 3.49 percent a month. The exception to check before you assume: your own bank loan rate. At 17.5 percent a year or higher, the bank loan outranks the Pag-IBIG MPL, and the order below BillEase changes."
      },
      {
        "q": "Is a Pag-IBIG Multi-Purpose Loan cheaper than a bank personal loan?",
        "a": "Not automatically. The MPL charges 1.4583 percent a month on a diminishing balance, which is about 17.5 percent a year, and bank personal loans commonly run 14 to 18 percent a year. A bank loan at 14 percent is cheaper than the MPL; one at 18 percent is not. The cheap government loan in the Philippines is the SSS salary loan at 8 percent a year, or a Pag-IBIG Calamity Loan at 5.95 percent when a calamity window is open, not the MPL."
      },
      {
        "q": "Can I have a Pag-IBIG MPL, a Calamity Loan, and a housing loan at the same time?",
        "a": "Generally yes. The MPL, Calamity Loan, and HELPs programs are treated as separate and distinct, and you can hold an MPL alongside a calamity loan and vice versa. Two conditions matter: any existing Pag-IBIG loan must be current, and your combined short-term loans cannot exceed 90 percent of your Total Accumulated Value. Any existing housing loan must also be current for a new housing application."
      },
      {
        "q": "What happens if I miss a Pag-IBIG MPL payment?",
        "a": "A penalty of 1/20 of 1 percent of the unpaid amount applies for every day of delay, which is about 1.5 percent a month, higher than the loan's own interest. The employer side carries a separate penalty for failing to remit what it deducted, but the borrower's exposure is the daily charge on the unpaid amount, plus the knock-on effect: an account in default disqualifies you from renewing or taking a new short-term loan until it is settled."
      },
      {
        "q": "Should I take out a bank loan to pay off BillEase?",
        "a": "If you qualify and the replaced balance genuinely stays at zero, the rate gap is decisive, a bank personal loan at 15 percent a year against BillEase at about 51 percent effective. The three conditions from the consolidation playbook still have to hold: the loan's rate is clearly below what you are replacing, you actually qualify at that rate, and the BillEase balance stays closed afterward rather than refilling. Miss any of the three and the loan adds a payment without fixing the behavior that created the balance."
      }
    ],
    "ctaLead": "See your own three-loan order, free",
    "ctaSub": "Add your real debts and see your avalanche-ordered plan, your projected debt-free date, and the interest you would save. No bank linking, manual entry or a CSV, and nothing to pay before you see the numbers."
  },
];
