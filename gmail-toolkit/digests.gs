const Week = {
  firstDayOfWeek: (date = new Date()) => {
    console.log(`[Week] firstDayOfWeek for: ${date}`);
    return new Date(new Date(date).setDate(date.getDate() - date.getDay()));
  },

  lastDayOfWeek: (date = new Date()) => {
    console.log(`[Week] lastDayOfWeek for: ${date}`);
    return new Date(
      new Date(date).setDate(Week.firstDayOfWeek(date).getDate() + 7)
    );
  },

  getWeekRange: (date = new Date()) => {
    console.log(`[Week] getWeekRange for: ${date}`);
    return [Week.firstDayOfWeek(date), Week.lastDayOfWeek(date)];
  },
};

class GmailSearch {
  constructor(params) {
    this.params = params;
  }

  one(params) {
    return this._execSearch(params, 1)[0];
  }

  many(params) {
    return this._execSearch(params, 150);
  }

  _compileQuery(params) {
    return Object.entries(params)
      .reduce((query, [key, value]) => {
        switch (key) {
          case "label":
            query.push(`in:${value}`);
            return query;
          case "before":
          case "after":
            query.push(
              `${key}:${value.getUTCFullYear()}/${
                value.getUTCMonth() + 1
              }/${value.getUTCDate()}`
            );
            return query;
          default:
            query.push(`${key}:"${value}"`);
            return query;
        }
      }, [])
      .join(" ");
  }

  _execSearch(params, limit) {
    const query = this._compileQuery({ ...this.params, ...params });
    console.log(`[GmailSearch] executing query: ${query}`);
    return GmailApp.search(query, 0, limit);
  }
}

class Digest {
  static get subjectBase() {
    return "Notes Digest";
  }

  constructor({ recipient, threads, after }) {
    this.recipient = recipient;
    this.threads = threads;
    this.after = after;
  }

  send(after, threads) {
    GmailApp.sendEmail(this.recipient, this._getSubject(), "", {
      name: "Notes",
      htmlBody: this._getBody(threads),
    });
  }

  print() {
    console.log(`[Digest] recipient: ${this.recipient}`);
    console.log(`[Digest] subject: ${this._getSubject()}`);
    //console.log(`[Digest] body: ${this._getBody()}`);
    return this;
  }

  _getSubject() {
    return `${Digest.subjectBase} - Week of ${this.after.toLocaleString(
      "default",
      { month: "short" }
    )} ${this.after.getUTCDate()}`;
  }

  _getBody() {
    return this.threads.reduce((body, thread) => {
      return body.concat(this._formatMessages(thread));
    }, "");
  }

  _formatMessages(thread) {
    return thread.getMessages().reduce((body, msg) => {
      return body.concat(
        `<p><font size="4">${
          msg.getSubject() || "(no subject)"
        }</font><br>${msg.getPlainBody()}</p><br>`
      );
    }, "");
  }
}

const Digests = {
  send: ({ label, recipient }) => {
    const search = new GmailSearch({ label, "-subject": Digest.subjectBase });

    const messagesBefore = Week.firstDayOfWeek();
    console.log(`[DigestScript] messages before: ${messagesBefore}`);

    const lastThread = search.one({ before: messagesBefore });

    if (!lastThread) {
      console.log(`[DigestScript] no messages found`);
      return;
    }

    console.log(
      `[DigestScript] last message subject: ${lastThread
        .getMessages()[0]
        .getSubject()}`
    );
    console.log(
      `[DigestScript] last message date: ${lastThread.getLastMessageDate()}`
    );

    const [after, before] = Week.getWeekRange(lastThread.getLastMessageDate());
    console.log(
      `[DigestScript] digest range, before: ${before} after: ${after}`
    );

    const threads = search.many({ after, before });
    console.log(`[DigestScript] threads for digest: ${threads.length}`);

    new Digest({ recipient, threads, after }).print().send();

    console.log(`[DigestScript] archiving threads`);
    threads.forEach((thread) => {
      thread.moveToTrash();
    });
  },
};
